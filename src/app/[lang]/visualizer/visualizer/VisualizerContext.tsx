// Paste into: visualizer/VisualizerContext.tsx

"use client";

import { createContext, useContext } from "react";
import type { useVisualizerController } from "./useVisualizerController";

type VisualizerValue = ReturnType<typeof useVisualizerController>;
export const VisualizerContext = createContext<VisualizerValue | null>(null);

export function useVisualizer() {
  const value = useContext(VisualizerContext);
  if (!value) throw new Error("VisualizerContext is missing");
  return value;
}
