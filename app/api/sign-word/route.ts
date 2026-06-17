import { NextResponse } from "next/server";

/**
 * Proxy to the local WLASL inference server (see wlasl-server/). The browser
 * records a short clip of one signed word and posts it here; we forward it to
 * the Python server that runs the VideoMAE-WLASL model on this machine.
 *
 * We self-host because HuggingFace no longer serves these models on its free
 * serverless Inference API. If the local server isn't running, we surface a
 * clear "server_down" error so the UI can tell the user to start it.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SERVER_URL =
  process.env.WLASL_SERVER_URL ?? "http://localhost:8000/predict";

type Candidate = { text: string; confidence: number };

export async function POST(req: Request) {
  const body = await req.arrayBuffer();
  if (!body.byteLength) {
    return NextResponse.json({ error: "empty_clip" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") ?? "video/webm",
      },
      body,
    });
  } catch {
    // ECONNREFUSED etc. — the local Python server isn't running/reachable.
    return NextResponse.json({ error: "server_down" }, { status: 503 });
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "inference_failed", detail: detail.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = (await res.json().catch(() => null)) as
    | { candidates?: Candidate[]; error?: string }
    | null;

  if (!data || data.error) {
    return NextResponse.json(
      { error: data?.error ?? "bad_response" },
      { status: 502 }
    );
  }

  const candidates = (data.candidates ?? [])
    .filter((d) => d && typeof d.text === "string")
    .slice(0, 3)
    .map((d) => ({ text: d.text, confidence: Number(d.confidence) || 0 }));

  return NextResponse.json({ candidates });
}
