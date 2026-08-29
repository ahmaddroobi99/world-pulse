import type { MetricId } from "./types";

export function formatMetricValue(id: MetricId, value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  switch (id) {
    case "gdpPerCapita":
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "population":
      if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
      return new Intl.NumberFormat("en").format(value);
    case "hdi":
      return value.toFixed(3);
    case "lifeExpectancy":
      return `${value.toFixed(1)} yr`;
    case "co2PerCapita":
      return `${value.toFixed(1)} t`;
    case "internetUsers":
      return `${value.toFixed(0)}%`;
  }
}

export function formatLegendTick(id: MetricId, value: number): string {
  switch (id) {
    case "gdpPerCapita":
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
      return `$${value.toFixed(0)}`;
    case "population":
      if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
      return `${(value / 1000).toFixed(0)}K`;
    case "hdi":
      return value.toFixed(2);
    case "lifeExpectancy":
      return value.toFixed(0);
    case "co2PerCapita":
      return value.toFixed(0);
    case "internetUsers":
      return `${value.toFixed(0)}%`;
  }
}

export function formatRank(rank: number, total: number): string {
  return `${rank} of ${total}`;
}

export function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

