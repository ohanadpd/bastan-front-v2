
"use client";
import { useVisualizer } from "./VisualizerContext";

export function AreaTabs({ showAdd = false }: { showAdd?: boolean }) {
  const { areas, activeAreaId, chooseArea, addArea } = useVisualizer();
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {areas.map((area, index) => (
        <button key={area.id} type="button" onClick={() => chooseArea(area.id)}
          className={`rounded-xl border px-4 py-2 text-xs font-semibold ${area.id === activeAreaId
            ? "border-primary bg-primary text-white"
            : "border-[#e1e4e8] bg-white text-[#555b65]"}`}>
          محدوده {index + 1}{area.tile.productName ? ` · ${area.tile.productName}` : ""}
        </button>
      ))}
      {showAdd && (
        <button type="button" onClick={addArea}
          disabled={areas.some((area) => area.points.length < 3)}
          className="rounded-xl border border-primary bg-white px-4 py-2 text-xs font-semibold text-primary disabled:opacity-40">
          + افزودن محدوده
        </button>
      )}
    </div>
  );
}
