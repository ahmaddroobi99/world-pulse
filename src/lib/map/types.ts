export type MetricId =
  | "gdpPerCapita"
  | "population"
  | "hdi"
  | "lifeExpectancy"
  | "co2PerCapita"
  | "internetUsers";

export type Region =
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Oceania"
  | "Other";

export type CountryRecord = {
  id: string;
  iso3: string;
  name: string;
  region: Region;
  gdpPerCapita: number | null;
  population: number | null;
  hdi: number | null;
  lifeExpectancy: number | null;
  co2PerCapita: number | null;
  internetUsers: number | null;
};

export type MetricDef = {
  id: MetricId;
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
  higherIsBetter: boolean;
};
