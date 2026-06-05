import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export async function SiteHeader() {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo size="sm" showThai={false} name={t("common.appName")} />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:inline-flex" })}
          >
            {t("nav.login")}
          </Link>
          <Link href="/register" className={buttonVariants({ size: "sm" })}>
            {t("nav.register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
