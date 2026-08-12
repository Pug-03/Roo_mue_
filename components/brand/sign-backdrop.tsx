import * as React from "react";
import { Hand, HandMetal, Grab } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Decorative, non-interactive backdrop for the landing and auth pages.
 *
 * A sparse, delicate line-art pattern of sign-language hand gestures clustered
 * near the top of the page (the hero), drifting slowly. The background itself
 * is left neutral/white so it never tints the sponsor logos below. Hands are
 * thin-stroked at low opacity and masked so they melt away before reaching the
 * content lower down. Purely cosmetic: aria-hidden + pointer-events-none.
 */

type Placed = {
  Icon: LucideIcon;
  left: string;
  top: string; // relative to the top decorative band
  size: number;
  rotate: number;
  opacity: number;
  duration: number; // seconds — slow, gradual drift
  delay: number;
};

// Mix of gestures, weighted toward the top, hand-tuned for an organic scatter.
const HANDS: Placed[] = [
  { Icon: Hand, left: "7%", top: "14%", size: 150, rotate: -14, opacity: 0.16, duration: 17, delay: 0 },
  { Icon: HandMetal, left: "23%", top: "6%", size: 96, rotate: 10, opacity: 0.12, duration: 21, delay: 2.5 },
  { Icon: Grab, left: "39%", top: "26%", size: 84, rotate: -6, opacity: 0.1, duration: 24, delay: 1 },
  { Icon: Hand, left: "57%", top: "9%", size: 122, rotate: 14, opacity: 0.14, duration: 19, delay: 3.5 },
  { Icon: HandMetal, left: "73%", top: "24%", size: 100, rotate: -20, opacity: 0.12, duration: 22, delay: 1.5 },
  { Icon: Hand, left: "91%", top: "13%", size: 150, rotate: 8, opacity: 0.15, duration: 18, delay: 0.8 },
  { Icon: Grab, left: "15%", top: "42%", size: 80, rotate: 22, opacity: 0.1, duration: 23, delay: 2 },
  { Icon: HandMetal, left: "85%", top: "44%", size: 92, rotate: 12, opacity: 0.1, duration: 20, delay: 4 },
];

export function SignBackdrop({
  className,
  tone = "primary",
}: {
  className?: string;
  /** "primary" for light backgrounds, "white" for the deep-blue gradient screens. */
  tone?: "primary" | "white";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Hands only — clustered near the top, masked to fade before the content
          below, slowly drifting. No color wash so logos stay on clean white. */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[85vh] [mask-image:radial-gradient(125%_100%_at_50%_16%,black,transparent_72%)]",
          tone === "white" ? "text-white" : "text-primary"
        )}
      >
        {HANDS.map(({ Icon, left, top, size, rotate, opacity, duration, delay }, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left, top }}
          >
            <Icon
              className="sign-hand block"
              style={{
                width: size,
                height: size,
                opacity,
                rotate: `${rotate}deg`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
              strokeWidth={1.1}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
