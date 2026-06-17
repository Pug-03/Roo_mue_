"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Landing-page sponsors / partners section.
 *
 * Logos live in `public/sponsors/<slug>.png` and are referenced by the `slug`
 * field below — edit these arrays (or drop a new PNG into that folder) to swap
 * a logo in. Until a real file exists, each card shows a styled name
 * placeholder and automatically upgrades to the image once it loads.
 */

type Sponsor = { name: string; slug: string };

// ── Organized by ────────────────────────────────────────────────────────────
const ORGANIZED_BY: Sponsor[] = [
  { name: "TWA", slug: "twa" },
  { name: "CAT", slug: "cat" },
  { name: "ABAC Communication Arts", slug: "abac-comm-arts" },
  { name: "Thai Media Fund", slug: "thai-media-fund" },
];

// ── Sponsors ────────────────────────────────────────────────────────────────
const VIP: Sponsor = {
  name: "ThaiCom Foundation × DreamAble",
  slug: "vip-thaicom-dreamable",
};
const PLATINUM: Sponsor = { name: "9arm", slug: "9arm" };
const GOLD: Sponsor[] = [
  { name: "Dek-D", slug: "dek-d" },
  { name: "SeedWebs", slug: "seedwebs" },
  { name: "Moonshot", slug: "moonshot" },
  { name: "Binance TH Academy", slug: "binance-th-academy" },
];
const SILVER: Sponsor[] = [
  { name: "Creators Gate", slug: "creators-gate" },
  { name: "Rainmaker", slug: "rainmaker" },
  { name: "Spaceth.co", slug: "spaceth-co" },
  { name: ".th", slug: "th" },
  { name: "AONA", slug: "aona" },
];
const SILVER_EXTRA: Sponsor[] = [
  { name: "Pranakorn", slug: "pranakorn" },
  { name: "MeMaytapriya", slug: "memaytapriya" },
];

// ── Partners & supporters ─────────────────────────────────────────────────────
const PARTNERS_ROW_1: Sponsor[] = [
  { name: "เกมบอกด้วย", slug: "gamebokduay" },
  { name: "มือล้นลำโปร", slug: "mueloncampro" },
  { name: "Dataholic", slug: "dataholic" },
  { name: "Designism", slug: "designism" },
  { name: "Ad Addict", slug: "ad-addict" },
];
const PARTNERS_ROW_2: Sponsor[] = [
  { name: "การตลาดวันละตอน", slug: "everyday-marketing" },
  { name: "Kamal", slug: "kamal" },
  { name: "CampHub", slug: "camphub" },
  { name: "Future Trends", slug: "future-trends" },
  { name: "Content Shifu", slug: "content-shifu" },
];
const PARTNERS_ROW_3: Sponsor[] = [
  { name: "iUrban", slug: "iurban" },
  { name: "Amaze", slug: "amaze" },
];

const BLUE = "#2563EB";

function SponsorCard({ name, slug, className }: Sponsor & { className?: string }) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn(
        "flex h-40 w-full items-center justify-center rounded-2xl p-6 transition-transform hover:scale-[1.02] sm:h-48 sm:p-8",
        className
      )}
    >
      {errored ? (
        // Styled name placeholder — shown only when the logo file is missing.
        <span className="rounded-lg bg-gray-100 px-4 py-2.5 text-center text-base font-semibold leading-tight text-gray-700 sm:text-lg">
          {name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/sponsors/${slug}.png`}
          alt={`${name} logo`}
          className="max-h-full max-w-full object-contain"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

function SectionHeader({ thai, english }: { thai: string; english: string }) {
  return (
    <div className="mb-14 flex flex-col items-center gap-4">
      <h2
        className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: BLUE }}
      >
        <span aria-hidden>* </span>
        {thai}
        <span aria-hidden> *</span>
      </h2>
      <span
        className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base"
        style={{ backgroundColor: BLUE }}
      >
        {english}
      </span>
    </div>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-center text-lg font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </p>
  );
}

export function SponsorsSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container space-y-24">
        {/* 1 ── Organized by ───────────────────────────────────────────── */}
        <div>
          <SectionHeader thai="จัดกิจกรรมโดย" english="Organized By" />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6">
            {ORGANIZED_BY.map((s) => (
              <SponsorCard key={s.slug} {...s} />
            ))}
          </div>
        </div>

        {/* 2 ── Sponsors ──────────────────────────────────────────────── */}
        <div>
          <SectionHeader thai="ผู้สนับสนุนโครงการ" english="Sponsors" />

          <div className="space-y-16">
            {/* VIP */}
            <div>
              <TierLabel>VIP</TierLabel>
              <div className="flex justify-center">
                <SponsorCard {...VIP} className="h-52 w-full max-w-4xl sm:h-64" />
              </div>
            </div>

            {/* Platinum */}
            <div>
              <TierLabel>Platinum</TierLabel>
              <div className="flex justify-center">
                <SponsorCard {...PLATINUM} className="h-56 w-full max-w-sm sm:h-64" />
              </div>
            </div>

            {/* Gold */}
            <div>
              <TierLabel>Gold</TierLabel>
              <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6">
                {GOLD.map((s) => (
                  <SponsorCard key={s.slug} {...s} />
                ))}
              </div>
            </div>

            {/* Silver */}
            <div>
              <TierLabel>Silver</TierLabel>
              <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {SILVER.map((s) => (
                  <SponsorCard key={s.slug} {...s} />
                ))}
              </div>
              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-6">
                {SILVER_EXTRA.map((s) => (
                  <SponsorCard key={s.slug} {...s} className="w-full max-w-xs" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 ── Partners & supporters ─────────────────────────────────── */}
        <div>
          <SectionHeader thai="ร่วมสนับสนุนโดย" english="Partners & Supporters" />

          <div className="mx-auto max-w-6xl space-y-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {PARTNERS_ROW_1.map((s) => (
                <SponsorCard key={s.slug} {...s} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {PARTNERS_ROW_2.map((s) => (
                <SponsorCard key={s.slug} {...s} />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {PARTNERS_ROW_3.map((s) => (
                <SponsorCard key={s.slug} {...s} className="w-full max-w-xs" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
