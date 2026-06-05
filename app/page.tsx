import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Sponsors } from "@/components/landing/sponsors";
import { SignBackdrop } from "@/components/brand/sign-backdrop";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SignBackdrop />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <Sponsors />
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Roo_mue
        </div>
      </footer>
    </div>
  );
}
