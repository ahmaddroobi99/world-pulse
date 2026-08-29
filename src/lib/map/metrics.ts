import type { MetricDef, MetricId } from "./types";

export const METRICS: MetricDef[] = [
  {
    id: "gdpPerCapita",
    label: "GDP per capita",
    shortLabel: "GDP / capita",
    unit: "USD",
    description: "Gross domestic product per person, current US dollars.",
    higherIsBetter: true,
  },
  {
    id: "population",
    label: "Population",
    shortLabel: "Population",
    unit: "people",
    description: "Estimated resident population.",
    higherIsBetter: true,
  },
  {
    id: "hdi",
    label: "Human Development Index",
    shortLabel: "HDI",
    unit: "index",
    description: "UNDP composite of life expectancy, education, and income.",
    higherIsBetter: true,
  },
  {
    id: "lifeExpectancy",
    label: "Life expectancy",
    shortLabel: "Life exp.",
    unit: "years",
    description: "Life expectancy at birth.",
    higherIsBetter: true,
  },
  {
    id: "co2PerCapita",
    label: "CO₂ per capita",
    shortLabel: "CO₂ / capita",
    unit: "t",
    description: "Annual carbon dioxide emissions per person, tonnes.",
    higherIsBetter: false,
  },
  {
    id: "internetUsers",
    label: "Internet users",
    shortLabel: "Internet",
    unit: "%",
    description: "Share of the population using the internet.",
    higherIsBetter: true,
  },
];

export const METRIC_BY_ID: Record<MetricId, MetricDef> = Object.fromEntries(
  METRICS.map((m) => [m.id, m]),
) as Record<MetricId, MetricDef>;
