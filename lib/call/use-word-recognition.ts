"use client";

import { useCallback, useRef, useState } from "react";
import {
  recordClip,
  classifyClip,
  WordServerDown,
} from "@/lib/translation/wlasl-client";
import type { Candidate } from "@/lib/translation";

export type WordStatus =
  | "idle"
  | "recording"
  | "classifying"
  | "ready"
  | "lowConfidence"
  | "error"
  | "serverDown";

// How long to record one signed word.
const CLIP_MS = 2000;
// The model always returns *some* word (no "unknown" class), so reject guesses
// below this confidence — otherwise it spits a random word when you don't sign.
const CONFIDENCE_THRESHOLD = 0.5;

/**
 * WLASL word-level mode. Recording is user-triggered (press to sign), since a
 * word is a deliberate motion: `record()` captures a short clip, classifies it,
 * and reports the top candidates. Returns granular status so the UI can show
 * "recording", "analyzing", config/availability errors, etc.
 */
export function useWordRecognition({
  streamRef,
}: {
  streamRef: React.RefObject<MediaStream | null>;
}) {
  const [status, setStatus] = useState<WordStatus>("idle");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const busyRef = useRef(false);

  const record = useCallback(async (): Promise<Candidate | null> => {
    const stream = streamRef.current;
    if (!stream || busyRef.current) return null;
    busyRef.current = true;
    try {
      setStatus("recording");
      const clip = await recordClip(stream, CLIP_MS);

      setStatus("classifying");
      const result = await classifyClip(clip);
      setCandidates(result);

      const top = result[0] ?? null;
      // Not confident enough — likely no clear sign was made. Don't commit it.
      if (!top || top.confidence < CONFIDENCE_THRESHOLD) {
        setStatus("lowConfidence");
        return null;
      }
      setStatus("ready");
      return top;
    } catch (err) {
      if (err instanceof WordServerDown) setStatus("serverDown");
      else setStatus("error");
      return null;
    } finally {
      busyRef.current = false;
    }
  }, [streamRef]);

  return { status, candidates, record };
}
