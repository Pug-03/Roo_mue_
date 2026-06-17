import { NextResponse } from "next/server";

/**
 * Server-side proxy to the HuggingFace Inference API for the
 * `prithivMLmods/Alphabet-Sign-Language-Detection` model (ASL alphabet A–Z,
 * SigLIP2 image classifier). The browser posts a single JPEG frame here; we
 * attach the secret token and forward it so the token never reaches the client.
 *
 * The model has no in-browser (ONNX/TFJS) build, so unlike the Thai-word model
 * this one must run remotely — frames are sent off-device for this mode only.
 */

export const runtime = "nodejs";
// Always run fresh; never cache an inference response.
export const dynamic = "force-dynamic";

const MODEL =
  process.env.HF_ALPHABET_MODEL ??
  "prithivMLmods/Alphabet-Sign-Language-Detection";
const HF_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

type HfPrediction = { label: string; score: number };

export async function POST(req: Request) {
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 500 });
  }

  const body = await req.arrayBuffer();
  if (!body.byteLength) {
    return NextResponse.json({ error: "empty_image" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": req.headers.get("content-type") ?? "image/jpeg",
        Accept: "application/json",
      },
      body,
    });
  } catch {
    return NextResponse.json({ error: "network" }, { status: 502 });
  }

  // 503 = the model is spinning up on HF's side; the client should keep polling.
  if (res.status === 503) {
    return NextResponse.json({ error: "loading" }, { status: 503 });
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "inference_failed", detail: detail.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = (await res.json().catch(() => null)) as HfPrediction[] | null;
  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "bad_response" }, { status: 502 });
  }

  // HF returns predictions already sorted by score; keep the top 2.
  const candidates = data
    .filter((d) => d && typeof d.label === "string")
    .slice(0, 2)
    .map((d) => ({ text: d.label, confidence: Number(d.score) || 0 }));

  return NextResponse.json({ candidates });
}
