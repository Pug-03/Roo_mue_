import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { SignBackdrop } from "@/components/brand/sign-backdrop";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SignBackdrop />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Roo_mue</p>
          <p>
            Made with care by kids from{" "}
            <span className="font-semibold text-foreground">
              Junior Webmaster Camp 14 (JWC14)
            </span>{" "}
            of Dubai International Airport
          </p>
        </div>
      </footer>
    </div>
  );
}
