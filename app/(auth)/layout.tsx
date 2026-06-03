import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30">
      <header className="w-full">
        <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-extrabold text-primary-foreground">
              R
            </span>
            <span className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
              {t("appName")}
            </span>
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
