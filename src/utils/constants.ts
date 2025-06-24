import { type CanvasPath } from "react-sketch-canvas";

export const normalizePaths = (paths: CanvasPath[], width: number, height: number): CanvasPath[] => {
  return paths.map((path) => ({
    ...path,
    paths: path.paths.map((p) => ({
      x: p.x / width,
      y: p.y / height,
    })),
  }));
};

export const denormalizePaths = (paths: CanvasPath[], width: number, height: number): CanvasPath[] => {
  return paths.map((path) => ({
    ...path,
    paths: path.paths.map((p) => ({
      x: p.x * width,
      y: p.y * height,
    })),
  }));
};
