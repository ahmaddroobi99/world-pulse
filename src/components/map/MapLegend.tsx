import { useMemo } from "react";
import { COUNTRIES } from "@/lib/map/countries";
import { CHOROPLETH_STOPS, makeColorScale, valuesForMetric } from "@/lib/map/colors";
import { formatLegendTick } from "@/lib/map/format";
import { METRIC_BY_ID } from "@/lib/map/metrics";
import { useMapStore } from "@/store/map-store";

export function MapLegend() {
  const metric = useMapStore((s) => s.metric);
  const def = METRIC_BY_ID[metric];
  const scale = useMemo(
    () => makeColorScale(valuesForMetric(COUNTRIES, metric)),
    [metric],
  );

  const mid = scale.breaks[Math.floor(scale.breaks.length / 2)];

  return (
    <aside
      className="pointer-events-none absolute top-3 left-3 z-20 w-[min(100%-1.5rem,16.5rem)] rounded-2xl bg-surface/90 p-3.5 shadow-[var(--shadow-panel)] backdrop-blur-sm md:top-auto md:bottom-5 md:left-5 md:w-[18.5rem] md:p-4"
      aria-label="Map legend"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
        {def.label}
      </p>
      <p className="mt-1 text-xs text-muted">{def.unit}</p>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
        {CHOROPLETH_STOPS.map((c) => (
          <span key={c} className="h-full flex-1" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-subtle">
        <span>Low</span>
        {mid != null ? <span>{formatLegendTick(metric, mid)}</span> : null}
        <span>High</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
        <span className="size-2.5 rounded-sm bg-map-nodata shadow-[var(--shadow-border)]" />
        No data
        {!def.higherIsBetter && (
          <span className="ml-auto hidden text-subtle sm:inline">
            Higher = more emissions
          </span>
        )}
      </div>
    </aside>
  );
}
