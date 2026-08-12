"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { CameraTranslate } from "./camera-translate";
import { HomeDashboard, type CategoryKey } from "./home-dashboard";
import type { HistoryItem } from "./history-list";

type View = "dashboard" | "camera";

function BackBar({ onBack }: { onBack: () => void }) {
  const t = useTranslations("app");
  return (
    <Button variant="ghost" size="sm" className="mb-4 px-2 sm:px-4" onClick={onBack}>
      <Icons.back className="size-5" aria-hidden />
      {t("back")}
    </Button>
  );
}

/** `/app` root: the dashboard, or the camera-translate flow for a tapped category. */
export function HomeFlow({ historyPreview }: { historyPreview: HistoryItem[] }) {
  const [view, setView] = useState<View>("dashboard");
  const [contextTag, setContextTag] = useState<CategoryKey | null>(null);

  if (view === "camera") {
    return (
      <div>
        <BackBar onBack={() => setView("dashboard")} />
        <CameraTranslate
          mode="everyday"
          contextTag={contextTag}
          onClose={() => setView("dashboard")}
        />
      </div>
    );
  }

  return (
    <HomeDashboard
      historyPreview={historyPreview}
      onSelectCategory={(key) => {
        setContextTag(key);
        setView("camera");
      }}
    />
  );
}
