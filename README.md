# World Pulse

Choropleth atlas of global development indicators. A map-first reading of public statistics — not a dashboard of invented metrics.

## What it is

A TypeScript atlas that colors countries by development indicators (health, economy, education, environment) so comparisons are spatial rather than tabular.

```
Public indicator tables
        ↓
  Join to country geometries
        ↓
  Choropleth + legend + year / indicator picker
        ↓
  Country detail
```

## Run

```bash
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## Honesty

Indicator values come from bundled public datasets. This repository does not scrape live government APIs at runtime unless a source file says otherwise. If a layer looks empty, the join key or year is missing — it is not a “zero” in the world.

## Related

- [engineering-portfolio](https://github.com/ahmaddroobi99/engineering-portfolio)
- [qg-lada-lab](https://github.com/ahmaddroobi99/qg-lada-lab) — geophysical, not geopolitical, but the same bias toward making fields inspectable

---

Account grouping: research first, undergraduate last — see the [profile README](https://github.com/ahmaddroobi99/ahmaddroobi99). GitHub cannot custom-sort the Repositories tab.

