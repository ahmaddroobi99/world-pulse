import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { CountryPanel } from "@/components/map/CountryPanel";
import { MapLegend } from "@/components/map/MapLegend";
import { MapTooltip } from "@/components/map/MapTooltip";
import { MetricSwitcher } from "@/components/map/MetricSwitcher";
import { WorldMap } from "@/components/map/WorldMap";
import { ZoomControls } from "@/components/map/ZoomControls";
import { useMapStore } from "@/store/map-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const select = useMapStore((s) => s.select);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  return (
    <main className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <header className="relative z-30 flex flex-col gap-3 border-b border-border bg-bg/85 px-3 py-3 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-elevated text-primary shadow-[var(--shadow-border)]">
            <Globe2 className="size-4" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-medium tracking-tight text-fg md:text-xl">
              World Pulse
            </h1>
            <p className="text-xs text-muted">
              Global indicators, one map. Pan, zoom, switch a metric.
            </p>
          </div>
        </div>
        <MetricSwitcher />
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 pb-[min(38vh,18rem)] md:pb-0">
          <WorldMap />
        </div>
        <MapTooltip />
        <MapLegend />
        <ZoomControls />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 md:inset-auto md:top-4 md:right-4 md:bottom-24 md:flex md:max-h-[calc(100%-7.5rem)]">
          <CountryPanel />
        </div>
      </div>
    </main>
  );
}
