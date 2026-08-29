import { METRICS } from "@/lib/map/metrics";
import { useMapStore } from "@/store/map-store";
import { cn } from "@/lib/utils";

export function MetricSwitcher() {
  const metric = useMapStore((s) => s.metric);
  const setMetric = useMapStore((s) => s.setMetric);

  return (
    <div
      role="tablist"
      aria-label="Choose a metric"
      className="flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-xl bg-elevated p-1 shadow-[var(--shadow-border)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {METRICS.map((m) => {
        const active = metric === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            data-active={active}
            onClick={() => setMetric(m.id)}
            className={cn(
              "h-9 shrink-0 rounded-lg px-3 text-xs font-medium whitespace-nowrap",
              "transition-[color,background-color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              "active:scale-[0.96]",
              active
                ? "bg-fg text-bg"
                : "text-muted hover:bg-fg/6 hover:text-fg",
            )}
          >
            {m.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
