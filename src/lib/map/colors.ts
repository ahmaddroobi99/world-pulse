import { quantile } from "d3-array";
import { scaleThreshold } from "d3-scale";
import type { CountryRecord, MetricId } from "./types";

/** Sequential seafoam scale — dark (low) to bright (high). */
export const CHOROPLETH_STOPS = [
  "#17343c",
  "#1c5863",
  "#21787c",
  "#2f9a88",
  "#7ec8b0",
  "#d7efe6",
] as const;

export const NO_DATA_FILL = "#1a232b";
export const OCEAN_FILL = "#0c1218";
export const COUNTRY_STROKE = "rgba(232, 238, 242, 0.14)";
export const HOVER_STROKE = "#d7efe6";
export const SELECT_STROKE = "#7ec8c3";

export function valuesForMetric(
  countries: CountryRecord[],
  metric: MetricId,
): number[] {
  return countries
    .map((c) => c[metric])
    .filter((v): v is number => v != null && Number.isFinite(v));
}

export function quantileBreaks(values: number[], classes: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const breaks: number[] = [];
  for (let i = 1; i < classes; i += 1) {
    const q = quantile(sorted, i / classes);
    if (q != null) breaks.push(q);
  }
  return breaks;
}

export function makeColorScale(values: number[]) {
  if (values.length === 0) {
    return {
      color: (_v: number | null) => NO_DATA_FILL,
      breaks: [] as number[],
      stops: [...CHOROPLETH_STOPS],
    };
  }
  const breaks = quantileBreaks(values, CHOROPLETH_STOPS.length);
  const scale = scaleThreshold<number, string>()
    .domain(breaks)
    .range([...CHOROPLETH_STOPS]);

  return {
    color: (v: number | null) => (v == null ? NO_DATA_FILL : scale(v)),
    breaks,
    stops: [...CHOROPLETH_STOPS],
  };
}

export function percentile(values: number[], value: number): number {
  if (values.length === 0) return 0;
  const below = values.filter((v) => v <= value).length;
  return Math.round((below / values.length) * 100);
}
