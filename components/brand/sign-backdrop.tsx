import * as React from "react";
import { Hand, HandMetal, Grab } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Decorative, non-interactive backdrop for the landing and auth pages.
 *
 * A soft blue→cyan gradient wash with two blurred color blobs, overlaid with a
 * sparse, delicate line-art pattern of sign-language hand gestures. The hands
 * are thin-stroked at low opacity and masked so they melt away toward the
 * edges — present enough to carry the theme, quiet enough to never compete with
 * foreground content. Purely cosmetic: aria-hidden + pointer-events-none.
 */

type Placed = {
  Icon: LucideIcon;
  left: string;
  top: string;
  size: number;
  rotate: number;
  opacity: number;
};

// Mix of gestures so it reads as "signing", hand-tuned for an organic scatter.
const HANDS: Placed[] = [
  { Icon: Hand, left: "4%", top: "14%", size: 132, rotate: -14, opacity: 0.16 },
  { Icon: Grab, left: "20%", top: "60%", size: 96, rotate: 10, opacity: 0.12 },
  { Icon: HandMetal, left: "38%", top: "24%", size: 84, rotate: -6, opacity: 0.1 },
  { Icon: Hand, left: "55%", top: "70%", size: 120, rotate: 16, opacity: 0.13 },
  { Icon: HandMetal, left: "70%", top: "12%", size: 92, rotate: -20, opacity: 0.12 },
  { Icon: Hand, left: "85%", top: "46%", size: 150, rotate: 8, opacity: 0.16 },
  { Icon: Grab, left: "90%", top: "82%", size: 80, rotate: -12, opacity: 0.1 },
  { Icon: Hand, left: "12%", top: "86%", size: 100, rotate: 22, opacity: 0.11 },
];

export function SignBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />

      {/* soft color blobs for depth */}
      <div className="absolute -left-32 -top-28 size-[30rem] rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -right-24 top-1/4 size-[26rem] rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 size-[28rem] rounded-full bg-primary/10 blur-3xl" />

      {/* sparse hand-gesture line art, faded toward the edges */}
      <div className="absolute inset-0 text-primary [mask-image:radial-gradient(125%_95%_at_50%_28%,black,transparent_76%)]">
        {HANDS.map(({ Icon, left, top, size, rotate, opacity }, i) => (
          <Icon
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left, top, width: size, height: size, rotate: `${rotate}deg`, opacity }}
            strokeWidth={1.1}
          />
        ))}
      </div>
    </div>
  );
}
