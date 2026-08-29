import { create } from "zustand";
import type { MetricId } from "@/lib/map/types";

type TooltipState = {
  x: number;
  y: number;
  id: string;
} | null;

type ZoomFns = {
  reset: () => void;
  bump: (dir: 1 | -1) => void;
};

type MapStore = {
  metric: MetricId;
  selectedId: string | null;
  hoveredId: string | null;
  tooltip: TooltipState;
  query: string;
  zoom: ZoomFns | null;
  setMetric: (metric: MetricId) => void;
  select: (id: string | null) => void;
  hover: (id: string | null, pos?: { x: number; y: number }) => void;
  setQuery: (query: string) => void;
  setZoom: (zoom: ZoomFns | null) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  metric: "hdi",
  selectedId: null,
  hoveredId: null,
  tooltip: null,
  query: "",
  zoom: null,
  setMetric: (metric) => set({ metric }),
  select: (id) => set({ selectedId: id }),
  hover: (id, pos) =>
    set({
      hoveredId: id,
      tooltip: id && pos ? { id, x: pos.x, y: pos.y } : null,
    }),
  setQuery: (query) => set({ query }),
  setZoom: (zoom) => set({ zoom }),
}));
