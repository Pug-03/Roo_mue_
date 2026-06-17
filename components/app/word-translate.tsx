"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useWordRecognition } from "@/lib/call/use-word-recognition";
import { useSpeak } from "@/lib/tts";
import { saveSession } from "@/app/app/actions";
import { cn } from "@/lib/utils";

type Phase = "permission" | "starting" | "denied" | "live";

/**
 * WLASL word-level ASL mode. The camera runs locally, but recognition is
 * server-side (HuggingFace VideoMAE-WLASL): the user presses "Sign a word",
 * which records a ~2s clip, sends it for classification, and appends the
 * recognized ASL word. The permission copy is explicit that clips leave the
 * device for this mode.
 */
export function WordTranslate({ onClose }: { onClose: () => void }) {
  const t = useTranslations("app.wlasl");
  // WLASL glosses are English words, so speak them with an English voice.
  const { say } = useSpeak("en");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("permission");
  const [insecure, setInsecure] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const { status, candidates, record } = useWordRecognition({ streamRef });

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(async () => {
    setInsecure(false);
    setPhase("starting");

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setInsecure(typeof window !== "undefined" && !window.isSecureContext);
      setPhase("denied");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;

      let tries = 0;
      while (!videoRef.current && tries++ < 20) {
        await new Promise((r) => setTimeout(r, 25));
      }
      const video = videoRef.current;
      if (!video) throw new Error("video element unavailable");
      video.srcObject = stream;
      await video.play().catch(() => {});
      setPhase("live");
    } catch {
      stopStream();
      setPhase("denied");
    }
  }, [stopStream]);

  useEffect(() => () => stopStream(), [stopStream]);

  const onSign = useCallback(async () => {
    const top = await record();
    if (top) {
      setWords((prev) => [...prev, top.text].slice(-12));
      setSaved(false);
      say(top.text);
    }
  }, [record, say]);

  const sentence = words.join(" ");
  const busy = status === "recording" || status === "classifying";

  async function saveSentence() {
    const text = sentence.trim();
    if (!text) return;
    await saveSession({
      mode: "everyday",
      contextTag: "wlasl",
      sentence: text,
      candidates: candidates.length ? candidates.slice(0, 2) : undefined,
      source: "camera",
    });
    setSaved(true);
  }

  const gateOpen = phase === "permission" || phase === "denied";

  return (
    <div className="relative grid gap-4 lg:grid-cols-[6fr_4fr]">
      {/* Left: camera preview */}
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 size-full -scale-x-100 object-cover"
          />
          {phase === "starting" && (
            <div className="absolute inset-0 grid place-items-center text-sm text-white">
              {t("starting")}
            </div>
          )}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {status === "recording" && (
              <span className="size-2 animate-pulse rounded-full bg-red-500" aria-hidden />
            )}
            {status === "recording"
              ? t("recording")
              : status === "classifying"
                ? t("analyzing")
                : t("frameHint")}
          </div>
        </div>
      </Card>

      {/* Right: record + recognized word */}
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        {status === "error" && (
          <p className="text-sm text-destructive">{t("modelError")}</p>
        )}
        {status === "lowConfidence" && (
          <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
            {t("lowConfidence")}
          </p>
        )}
        {status === "serverDown" && (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {t("serverDown")}
          </p>
        )}

        <Button
          size="lg"
          className="h-16 text-lg"
          onClick={onSign}
          disabled={phase !== "live" || busy}
        >
          {busy ? (
            <>
              <span className="size-2 animate-pulse rounded-full bg-current" aria-hidden />
              {status === "recording" ? t("recording") : t("analyzing")}
            </>
          ) : (
            <>
              <Icons.camera className="size-6" aria-hidden />
              {t("signWord")}
            </>
          )}
        </Button>

        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-medium text-muted-foreground">{t("recognized")}</p>
          {candidates[0] ? (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 break-words text-2xl font-extrabold capitalize sm:text-3xl">
                  {candidates[0].text}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {Math.round(candidates[0].confidence * 100)}%
                </span>
              </div>
              {candidates[1] && (
                <button
                  type="button"
                  onClick={() => say(candidates[1].text)}
                  className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span className="text-muted-foreground">
                    {t("alternative")}:{" "}
                    <span className="font-semibold capitalize text-foreground">
                      {candidates[1].text}
                    </span>
                  </span>
                  <Icons.playAudio className="size-4 text-muted-foreground" aria-hidden />
                </button>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">{t("pressToBegin")}</p>
          )}
        </div>

        {/* Collected words */}
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">{t("words")}</p>
          <div
            className={cn(
              "min-h-12 break-words rounded-lg bg-secondary/60 p-3 text-lg font-semibold capitalize",
              !sentence && "font-normal"
            )}
          >
            {sentence || (
              <span className="text-base text-muted-foreground">{t("empty")}</span>
            )}
          </div>
        </div>

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={() => say(sentence)} disabled={!sentence.trim()}>
            <Icons.playAudio className="size-5" aria-hidden />
            {t("play")}
          </Button>
          <Button onClick={saveSentence} disabled={!sentence.trim()}>
            <Icons.confirm className="size-5" aria-hidden />
            {t("save")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setWords([]);
              setSaved(false);
            }}
            disabled={words.length === 0}
          >
            {t("clear")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              stopStream();
              onClose();
            }}
          >
            <Icons.close className="size-5" aria-hidden />
            {t("stop")}
          </Button>
        </div>

        {saved && (
          <p role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <Icons.confirm className="size-4" aria-hidden />
            {t("saved")}
          </p>
        )}
      </Card>

      {/* Permission gate — explicit that clips are sent to a server. */}
      {gateOpen && (
        <div className="absolute inset-0 z-20 grid place-items-center rounded-xl bg-black/55 p-4">
          <Card className="w-full max-w-md p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Icons.camera className="size-6 text-primary" aria-hidden />
              <h2 className="text-lg font-bold">{t("permissionTitle")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{t("permissionBody")}</p>
            {phase === "denied" && (
              <p role="alert" className="mt-3 text-sm font-medium text-destructive">
                {insecure ? t("insecure") : t("denied")}
              </p>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button className="flex-1" onClick={start}>
                <Icons.confirm className="size-5" aria-hidden />
                {phase === "denied" ? t("retry") : t("allow")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
