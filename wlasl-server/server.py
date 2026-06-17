"""
Local WLASL inference server for Roo_mue.

Runs a VideoMAE fine-tune of WLASL (word-level American Sign Language) on this
machine, because HuggingFace no longer serves these models on its free
serverless Inference API. The Next.js route at /api/sign-word forwards recorded
clips here.

Run:
    cd wlasl-server
    python -m venv .venv && .venv\\Scripts\\activate   (Windows)
    pip install -r requirements.txt
    python server.py

First start downloads the model (~350 MB) from HuggingFace, then it is cached.
"""

import os
import tempfile

import av
import numpy as np
import torch
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoImageProcessor, AutoModelForVideoClassification

MODEL_ID = os.environ.get("WLASL_MODEL", "Shawon16/VideoMAE_WLASL_100_SR_8")
PORT = int(os.environ.get("WLASL_PORT", "8000"))

print(f"[wlasl] loading model: {MODEL_ID} (first run downloads weights)…")
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForVideoClassification.from_pretrained(MODEL_ID)
model.eval()

# How many frames the model expects (VideoMAE is typically 16).
NUM_FRAMES = int(getattr(model.config, "num_frames", 16) or 16)
ID2LABEL = model.config.id2label
print(f"[wlasl] ready — {len(ID2LABEL)} classes, {NUM_FRAMES} frames/clip")

app = FastAPI(title="Roo_mue WLASL server")
# The Next.js dev server calls this from the browser-side route (server→server),
# but allow CORS too in case it is called directly during debugging.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def decode_frames(data: bytes) -> list[np.ndarray]:
    """Decodes a video clip (webm/mp4) into a list of RGB frames."""
    with tempfile.NamedTemporaryFile(suffix=".video", delete=False) as f:
        f.write(data)
        path = f.name
    frames: list[np.ndarray] = []
    try:
        container = av.open(path)
        for frame in container.decode(video=0):
            frames.append(frame.to_ndarray(format="rgb24"))
        container.close()
    except Exception as e:  # noqa: BLE001 — surface decode issues to the client
        print(f"[wlasl] decode error: {e}")
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass
    return frames


def sample_frames(frames: list[np.ndarray], n: int) -> list[np.ndarray]:
    """Evenly samples n frames; pads by repeating the last if too few."""
    if not frames:
        return []
    if len(frames) <= n:
        return frames + [frames[-1]] * (n - len(frames))
    idx = np.linspace(0, len(frames) - 1, n).astype(int)
    return [frames[i] for i in idx]


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_ID, "num_frames": NUM_FRAMES,
            "classes": len(ID2LABEL)}


@app.post("/predict")
async def predict(request: Request):
    data = await request.body()
    if not data:
        return {"error": "empty_clip"}

    frames = sample_frames(decode_frames(data), NUM_FRAMES)
    if not frames:
        return {"error": "decode_failed"}

    inputs = processor(frames, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits[0]
    probs = torch.softmax(logits, dim=-1)

    k = min(3, probs.shape[-1])
    top = torch.topk(probs, k=k)
    candidates = [
        {"text": ID2LABEL[int(i)], "confidence": float(p)}
        for p, i in zip(top.values, top.indices)
    ]
    return {"candidates": candidates}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=PORT)
