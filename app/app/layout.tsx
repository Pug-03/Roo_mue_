import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { AppNav } from "@/components/app/app-nav";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const t = await getTranslations("app");

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="border-b bg-background">
        <div className="container flex min-h-16 items-center justify-between gap-3 py-3">
          <Link
            href="/app"
            className="min-w-0 text-lg font-extrabold tracking-tight sm:text-xl"
          >
            Roo_mue
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <SignOutButton label={t("signOut")} />
          </div>
        </div>
        <div className="pb-3 sm:container">
          <AppNav />
        </div>
      </header>
      <main className="container flex-1 py-5 sm:py-8">{children}</main>
    </div>
  );
}
