import * as React from "react";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Roo_mue brand assets.
 *
 * `BrandMark` is the app icon: a soft blue→cyan gradient squircle with a top
 * sheen, hairline ring and colored shadow, holding a clean open-hand line icon
 * (the sign-language / รู้มือ "know-hand" motif). `Logo` pairs it with the
 * wordmark. Sizing is driven entirely by the `size-*` class passed in, so the
 * mark stays crisp from a 32px header chip up to the hero.
 */

const markSizes = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
} as const;

const wordSizes = {
  sm: "text-base",
  md: "text-lg sm:text-xl",
  lg: "text-2xl sm:text-3xl",
} as const;

type Size = keyof typeof markSizes;

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-[28%]",
        "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500",
        "shadow-lg shadow-blue-600/25 ring-1 ring-inset ring-white/25",
        className
      )}
    >
      {/* top sheen for a soft, glossy feel */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
      <Hand
        className="relative size-[56%] text-white drop-shadow-sm"
        strokeWidth={2}
      />
    </span>
  );
}

export function Logo({
  size = "md",
  showWordmark = true,
  showThai = true,
  gradient = false,
  name = "Roo_mue",
  className,
}: {
  size?: Size;
  showWordmark?: boolean;
  showThai?: boolean;
  gradient?: boolean;
  name?: string;
  className?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <BrandMark className={markSizes[size]} />
      {showWordmark && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "truncate font-extrabold tracking-tight",
              wordSizes[size],
              gradient
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                : "text-foreground"
            )}
          >
            {name}
          </span>
          {showThai && (
            <span className="mt-1 truncate text-[0.7em] font-medium text-muted-foreground">
              รู้มือ · Thai Sign Language
            </span>
          )}
        </span>
      )}
    </span>
  );
}
