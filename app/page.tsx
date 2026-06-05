import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { SponsorsSection } from "@/components/landing/SponsorsSection";
import { SignBackdrop } from "@/components/brand/sign-backdrop";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SignBackdrop />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <SponsorsSection />
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Roo_mue
        </div>
      </footer>
    </div>
  );
}
