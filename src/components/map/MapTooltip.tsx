import { COUNTRY_BY_ID, countryByGeoId, rankOf } from "@/lib/map/countries";
import { formatMetricValue } from "@/lib/map/format";
import { METRIC_BY_ID } from "@/lib/map/metrics";
import { useMapStore } from "@/store/map-store";

export function MapTooltip() {
  const tooltip = useMapStore((s) => s.tooltip);
  const metric = useMapStore((s) => s.metric);
  if (!tooltip) return null;

  const rec = COUNTRY_BY_ID[tooltip.id] ?? countryByGeoId(tooltip.id);
  const name = rec?.name ?? tooltip.id;
  const value = rec ? rec[metric] : null;
  const ranking = rec ? rankOf(rec.id, metric) : null;
  const def = METRIC_BY_ID[metric];

  return (
    <div
      className="pointer-events-none absolute z-30 max-w-64 rounded-xl bg-elevated px-3.5 py-3 shadow-[var(--shadow-panel)]"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: "translate(16px, 16px)",
      }}
      role="tooltip"
    >
      <p className="font-display text-sm font-medium tracking-tight text-fg">{name}</p>
      <p className="mt-1 font-mono text-base tabular-nums text-primary">
        {formatMetricValue(metric, value)}
      </p>
      <p className="mt-0.5 text-xs text-muted">
        {def.label}
        {ranking ? ` · #${ranking.rank}` : value == null ? " · No data" : ""}
      </p>
    </div>
  );
}
