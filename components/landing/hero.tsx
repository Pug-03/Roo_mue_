import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { BrandMark } from "@/components/brand/logo";
import { FeatureGrid } from "./feature-grid";

export async function Hero() {
  const t = await getTranslations("landing");

  return (
    <section className="container grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
      {/* Left: copy + CTAs */}
      <div className="max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <BrandMark className="size-20 sm:size-24" />
          <div className="leading-none">
            <p className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              Roo_mue
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
              รู้มือ · Thai Sign Language
            </p>
          </div>
        </div>

        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3 py-1.5 text-sm font-medium text-secondary-foreground backdrop-blur">
          <Icons.fast className="size-4 text-primary" aria-hidden />
          {t("tagline")}
        </p>

        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <span className="block text-gray-900 dark:text-foreground">
            {t("headlineLine1")}
          </span>
          <span className="block text-blue-600 dark:text-primary">
            {t("headlineLine2")}
          </span>
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
          {t("subtext")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className={buttonVariants({ size: "lg" })}
          >
            {t("ctaPrimary")}
            <Icons.next className="size-5" aria-hidden />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>

      {/* Right: feature grid */}
      <FeatureGrid />
    </section>
  );
}
