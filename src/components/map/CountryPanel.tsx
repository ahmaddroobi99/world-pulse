import { useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  COUNTRIES,
  COUNTRY_BY_ID,
  countryByGeoId,
  rankOf,
  rankedCountries,
} from "@/lib/map/countries";
import { makeColorScale, percentile, valuesForMetric } from "@/lib/map/colors";
import { formatMetricValue, formatRank, ordinal } from "@/lib/map/format";
import { METRIC_BY_ID, METRICS } from "@/lib/map/metrics";
import type { CountryRecord, MetricId } from "@/lib/map/types";
import { useMapStore } from "@/store/map-store";
import { cn } from "@/lib/utils";

function MetricBar({
  country,
  metric,
}: {
  country: CountryRecord;
  metric: MetricId;
}) {
  const def = METRIC_BY_ID[metric];
  const values = useMemo(() => valuesForMetric(COUNTRIES, metric), [metric]);
  const value = country[metric];
  const pct = value == null ? 0 : percentile(values, value);
  const scale = useMemo(() => makeColorScale(values), [values]);
  const ranking = rankOf(country.id, metric);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted">{def.shortLabel}</span>
        <span className="font-mono text-xs tabular-nums text-fg">
          {formatMetricValue(metric, value)}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]"
          style={{
            width: `${pct}%`,
            background: scale.color(value),
          }}
        />
      </div>
      <p className="mt-1 text-[10px] text-subtle">
        {ranking ? `Rank ${formatRank(ranking.rank, ranking.total)}` : "No ranking"}
        {" · "}
        {ordinal(pct)} percentile
      </p>
    </div>
  );
}

function RankRow({
  country,
  metric,
  rank,
}: {
  country: CountryRecord;
  metric: MetricId;
  rank: number;
}) {
  const select = useMapStore((s) => s.select);
  const selectedId = useMapStore((s) => s.selectedId);
  const values = useMemo(() => valuesForMetric(COUNTRIES, metric), [metric]);
  const scale = useMemo(() => makeColorScale(values), [values]);
  const value = country[metric];

  return (
    <button
      onClick={() => select(country.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-[var(--motion-quick)]",
        selectedId === country.id ? "bg-fg/8" : "hover:bg-fg/5",
      )}
    >
      <span className="w-6 font-mono text-[11px] tabular-nums text-subtle">{rank}</span>
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ background: scale.color(value) }}
      />
      <span className="min-w-0 flex-1 truncate text-sm text-fg">{country.name}</span>
      <span className="font-mono text-xs tabular-nums text-muted">
        {formatMetricValue(metric, value)}
      </span>
    </button>
  );
}

export function CountryPanel() {
  const selectedId = useMapStore((s) => s.selectedId);
  const metric = useMapStore((s) => s.metric);
  const query = useMapStore((s) => s.query);
  const setQuery = useMapStore((s) => s.setQuery);
  const select = useMapStore((s) => s.select);
  const def = METRIC_BY_ID[metric];

  const selected = selectedId
    ? (COUNTRY_BY_ID[selectedId] ?? countryByGeoId(selectedId))
    : undefined;

  const ranked = useMemo(() => rankedCountries(metric), [metric]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? COUNTRIES.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.iso3.toLowerCase().includes(q),
        )
      : ranked.slice(0, 12);
    return list;
  }, [query, ranked]);

  return (
    <aside
      className={cn(
        "pointer-events-auto z-20 flex min-h-0 max-h-[min(38vh,18rem)] w-full flex-col overflow-hidden rounded-t-2xl bg-surface shadow-[var(--shadow-panel)]",
        "md:h-full md:max-h-full md:w-[22.5rem] md:rounded-2xl",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search className="size-4 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries"
          aria-label="Search countries"
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        {selected && (
          <button
            onClick={() => select(null)}
            className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-fg/6 hover:text-fg"
            aria-label="Clear selection"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {selected ? (
          <div key={selected.id} className="panel-enter">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              {selected.region}
              {selected.iso3 ? ` · ${selected.iso3}` : ""}
            </p>
            <h2 className="mt-1 text-2xl font-medium text-fg">{selected.name}</h2>
            <p className="mt-3 font-mono text-3xl tabular-nums tracking-tight text-primary">
              {formatMetricValue(metric, selected[metric])}
            </p>
            <p className="mt-1 text-sm text-muted">{def.description}</p>
            <div className="mt-6 space-y-4">
              {METRICS.map((m) => (
                <MetricBar key={m.id} country={selected} metric={m.id} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              {query.trim() ? "Matches" : `Highest ${def.shortLabel}`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {query.trim()
                ? "Select a country to inspect every indicator."
                : "Click a country on the map, or pick from the ranking."}
            </p>
            <div className="mt-3 divide-y divide-border">
              {(query.trim() ? filtered : ranked.slice(0, 12)).map((c, i) => (
                <RankRow
                  key={c.id}
                  country={c}
                  metric={metric}
                  rank={query.trim() ? (rankOf(c.id, metric)?.rank ?? i + 1) : i + 1}
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">No countries match.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
