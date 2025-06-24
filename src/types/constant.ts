import type { Point } from "react-sketch-canvas";

export type CanvasPathData = {
  paths: Point[];
  strokeWidth: number;
  strokeColor: string;
  drawMode: boolean;
  startTimestamp?: number;
  endTimestamp?: number;
  created_by?: string;
};
