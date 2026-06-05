import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import type { LucideIcon } from "@/components/icons";

type Feature = {
  key: "capture" | "ai" | "meanings" | "tts" | "emergency" | "history";
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  { key: "capture", Icon: Icons.featureCamera },
  { key: "ai", Icon: Icons.featureAi },
  { key: "meanings", Icon: Icons.featureMeanings },
  { key: "tts", Icon: Icons.featureTts },
  { key: "emergency", Icon: Icons.featureEmergency },
  { key: "history", Icon: Icons.featureHistory },
];

export async function FeatureGrid() {
  const t = await getTranslations("landing.features");

  return (
    <ul className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-5">
      {FEATURES.map(({ key, Icon }) => (
        <li key={key}>
          <Card className="flex h-full items-center gap-4 p-5 transition-shadow hover:shadow-lg sm:gap-5 sm:p-6">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 sm:size-16">
              <Icon className="size-7 text-primary sm:size-8" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight sm:text-lg">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-1 text-sm leading-snug text-muted-foreground sm:text-base">
                {t(`${key}.subtitle`)}
              </p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
