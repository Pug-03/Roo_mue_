"use client";

import type { Candidate } from "./types";

/**
 * Client for the WLASL word-level ASL mode. Records a short clip of one signed
 * word from the live MediaStream and posts it to our server proxy, which runs
 * the VideoMAE-WLASL model on HuggingFace.
 *
 * Unlike the (removed) A–Z mode, this captures a *video clip*, not a single
 * frame, because word signs are motions over time.
 */

/**
 * Thrown when the local WLASL inference server isn't running or can't be
 * reached. The user needs to start it (see wlasl-server/README.md).
 */
export class WordServerDown extends Error {
  constructor() {
    super("server_down");
    this.name = "WordServerDown";
  }
}

/** Picks the most server-friendly clip container the browser can record. */
function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m));
}

/** Records `durationMs` of the stream and resolves with the clip blob. */
export function recordClip(
  stream: MediaStream,
  durationMs: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof MediaRecorder === "undefined") {
      reject(new Error("recorder_unsupported"));
      return;
    }
    const mimeType = pickMimeType();
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (e) {
      reject(e);
      return;
    }
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    rec.onerror = () => reject(new Error("record_failed"));
    rec.onstop = () =>
      resolve(new Blob(chunks, { type: rec.mimeType || "video/webm" }));
    rec.start();
    window.setTimeout(() => {
      if (rec.state !== "inactive") rec.stop();
    }, durationMs);
  });
}

/** Sends a recorded clip to the server and returns the top word candidates. */
export async function classifyClip(
  clip: Blob,
  signal?: AbortSignal
): Promise<Candidate[]> {
  const res = await fetch("/api/sign-word", {
    method: "POST",
    headers: { "Content-Type": clip.type || "video/webm" },
    body: clip,
    signal,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const code = data?.error as string | undefined;
    // Local inference server not running/reachable.
    if (res.status === 503 || code === "server_down") {
      throw new WordServerDown();
    }
    throw new Error(code ?? `http_${res.status}`);
  }

  const { candidates } = (await res.json()) as { candidates: Candidate[] };
  return candidates ?? [];
}
