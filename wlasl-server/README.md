# Roo_mue — Local WLASL inference server

HuggingFace no longer serves WLASL models on its free Inference API, so the
ASL-word camera mode runs the model **locally** through this small FastAPI
server. The Next.js route at `app/api/sign-word/route.ts` forwards recorded
clips to it.

## One-time setup (Windows / PowerShell)

```powershell
cd wlasl-server
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> First run downloads the model weights (~350 MB) from HuggingFace and caches
> them under your user profile. Needs internet only the first time.

## Run it

```powershell
# from wlasl-server, with the venv active:
python server.py
```

You should see `[wlasl] ready — 100 classes, 16 frames/clip` and the server
listening on http://127.0.0.1:8000 . Check it:

```powershell
curl http://127.0.0.1:8000/health
```

Leave this window open while you use the ASL-word mode in the app.

## How it connects

- The Next.js app calls `POST /api/sign-word` (its own route).
- That route forwards the clip to `WLASL_SERVER_URL`
  (default `http://localhost:8000/predict`).
- If this server isn't running, the app shows a "start the recognition server"
  message instead of a result.

## Options

Environment variables (optional):

| Var           | Default                            | Meaning                       |
| ------------- | ---------------------------------- | ----------------------------- |
| `WLASL_MODEL` | `Shawon16/VideoMAE_WLASL_100_SR_8` | Any VideoMAE-WLASL model id   |
| `WLASL_PORT`  | `8000`                             | Port to listen on             |

If you change the port, also set `WLASL_SERVER_URL` in the project `.env`
(e.g. `WLASL_SERVER_URL="http://localhost:8001/predict"`) and restart `pnpm dev`.
