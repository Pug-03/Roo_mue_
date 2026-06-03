import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { FeatureGrid } from "./feature-grid";

export async function Hero() {
  const t = await getTranslations("landing");

  return (
    <section className="container grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
      {/* Left: copy + CTAs */}
      <div className="max-w-xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
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
