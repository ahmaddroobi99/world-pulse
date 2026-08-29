import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/store/map-store";

export function ZoomControls() {
  const zoom = useMapStore((s) => s.zoom);

  return (
    <div className="absolute right-3 bottom-[min(40vh,19rem)] z-20 flex flex-col gap-1 rounded-2xl bg-surface/90 p-1.5 shadow-[var(--shadow-panel)] backdrop-blur-sm md:right-5 md:bottom-5">
      <Button
        variant="ghost"
        size="icon"
        className="size-10"
        aria-label="Zoom in"
        onClick={() => zoom?.bump(1)}
      >
        <Plus />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-10"
        aria-label="Zoom out"
        onClick={() => zoom?.bump(-1)}
      >
        <Minus />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-10"
        aria-label="Reset view"
        onClick={() => zoom?.reset()}
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
