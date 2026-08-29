import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import { zoom as d3Zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { COUNTRIES, COUNTRY_BY_ID, countryByGeoId } from "@/lib/map/countries";
import {
  COUNTRY_STROKE,
  HOVER_STROKE,
  OCEAN_FILL,
  SELECT_STROKE,
  makeColorScale,
  valuesForMetric,
} from "@/lib/map/colors";
import { useMapStore } from "@/store/map-store";

type CountryFeature = Feature<Geometry, { name?: string }>;

const SKIP_IDS = new Set(["010", "260"]);

function geoKey(f: CountryFeature): string {
  if (f.id != null && f.id !== "") return String(f.id).padStart(3, "0");
  return f.properties?.name ?? "unknown";
}

export function WorldMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ w: 1200, h: 720 });
  const [geos, setGeos] = useState<CountryFeature[]>([]);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [failed, setFailed] = useState(false);

  const metric = useMapStore((s) => s.metric);
  const selectedId = useMapStore((s) => s.selectedId);
  const hoveredId = useMapStore((s) => s.hoveredId);
  const selectCountry = useMapStore((s) => s.select);
  const hover = useMapStore((s) => s.hover);
  const setZoom = useMapStore((s) => s.setZoom);

  const colorScale = useMemo(() => {
    return makeColorScale(valuesForMetric(COUNTRIES, metric));
  }, [metric]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({ w: Math.max(320, cr.width), h: Math.max(280, cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/world-110m.json")
      .then((r) => {
        if (!r.ok) throw new Error("map load failed");
        return r.json();
      })
      .then((topo: Topology<{ countries: GeometryCollection }>) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as FeatureCollection<
          Geometry,
          { name?: string }
        >;
        setGeos(
          fc.features.filter((f) => !SKIP_IDS.has(geoKey(f as CountryFeature))),
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(() => {
    return geoNaturalEarth1().fitExtent(
      [
        [24, 28],
        [size.w - 24, size.h - 36],
      ],
      { type: "Sphere" },
    );
  }, [size.w, size.h]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule()(), []);
  const spherePath = useMemo(() => pathGen({ type: "Sphere" }) ?? "", [pathGen]);
  const graticulePath = useMemo(
    () => pathGen(graticule) ?? "",
    [pathGen, graticule],
  );

  const resetZoom = useCallback(() => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z) return;
    select(svg).transition().duration(400).call(z.transform, zoomIdentity);
  }, []);

  const bumpZoom = useCallback((dir: 1 | -1) => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z) return;
    select(svg)
      .transition()
      .duration(200)
      .call(z.scaleBy, dir === 1 ? 1.4 : 1 / 1.4);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const z = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .extent([
        [0, 0],
        [size.w, size.h],
      ])
      .translateExtent([
        [-size.w * 0.15, -size.h * 0.15],
        [size.w * 1.15, size.h * 1.15],
      ])
      .on("zoom", (event) => {
        setTransform(event.transform);
      });
    zoomRef.current = z;
    const sel = select(svg);
    sel.call(z);
    sel.on("dblclick.zoom", null);
    setZoom({ reset: resetZoom, bump: bumpZoom });
    return () => {
      sel.on(".zoom", null);
      setZoom(null);
    };
  }, [size.w, size.h, resetZoom, bumpZoom, setZoom]);

  const onMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>, id: string) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      hover(id, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    },
    [hover],
  );

  if (failed) {
    return (
      <div
        ref={wrapRef}
        className="flex h-full w-full items-center justify-center bg-bg text-sm text-muted"
      >
        Could not load the world map.
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden bg-bg">
      {geos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Drawing the atlas…
        </div>
      )}
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        className="block h-full w-full touch-none"
        role="img"
        aria-label="World choropleth map"
      >
        <rect width={size.w} height={size.h} fill="var(--color-bg)" />
        <g transform={transform.toString()}>
          <path d={spherePath} fill={OCEAN_FILL} />
          <path
            d={graticulePath}
            fill="none"
            stroke="rgba(232,238,242,0.045)"
            strokeWidth={0.6}
          />
          {geos.map((f) => {
            const id = geoKey(f);
            const rec = countryByGeoId(f.id, f.properties?.name) ?? COUNTRY_BY_ID[id];
            const value = rec ? rec[metric] : null;
            const fill = colorScale.color(value);
            const d = pathGen(f);
            if (!d) return null;
            const isSel = selectedId === id;
            const isHov = hoveredId === id;
            return (
              <path
                key={id}
                d={d}
                className="country-path"
                fill={fill}
                stroke={isSel ? SELECT_STROKE : isHov ? HOVER_STROKE : COUNTRY_STROKE}
                strokeWidth={isSel ? 1.4 : isHov ? 1.1 : 0.4}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                tabIndex={0}
                role="button"
                aria-label={rec?.name ?? f.properties?.name ?? id}
                aria-pressed={isSel}
                onMouseEnter={(e) => onMove(e, id)}
                onMouseMove={(e) => onMove(e, id)}
                onMouseLeave={() => hover(null)}
                onFocus={() => hover(id, { x: size.w / 2, y: 48 })}
                onBlur={() => hover(null)}
                onClick={() => selectCountry(selectedId === id ? null : id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectCountry(selectedId === id ? null : id);
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
