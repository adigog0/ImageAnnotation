import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef, type CanvasPath, type Point } from "react-sketch-canvas";
import { cn } from "../../lib/tailwind";
import RedoIcon from "../../assets/icons/redo.svg?react";
import UndoIcon from "../../assets/icons/undo.svg?react";
import CancelIcon from "../../assets/icons/cancel.svg?react";
import DoneIcon from "../../assets/icons/done.svg?react";
import Stroke1 from "../../assets/icons/stroke1.svg?react";
import Stroke2 from "../../assets/icons/stroke2.svg?react";
import Stroke3 from "../../assets/icons/stroke3.svg?react";
import Stroke4 from "../../assets/icons/stroke4.svg?react";
import EraseIcon from "../../assets/icons/Eraser.svg?react";
import ColorPickerButton from "../colorPickerButton/ColorPickerButton";
import { useDebounce } from "../../hooks/useDebounce";

export type SketchActions = "Redo" | "Undo" | "Cancel" | "Done";
export type SketchOptions = "Erase" | "Pen" | "pick color";

interface SketchCanvasProps {
  image_url: string;
  canvasPath?: CanvasPath[] | null;
  handleUpdatePath: (path: CanvasPath[]) => void;
  handleSetMainAction: () => void;
  drawingOptions?: {
    strokeColor?: string;
    strokeWidth?: number;
  };
  inDrawMode: boolean;
  sketchCanvasStyle?: React.CSSProperties;
  onDrawStart?: () => void;
  onDrawEnd?: () => void;
  toolbarOptions?: {
    topToolbarIcons?: Partial<Record<SketchActions, React.ReactNode>>;
    strokeIcons?: {
      colorPickerIcon?: React.ReactNode;
      eraserIcon?: React.ReactNode;
      strokeWidthIcons?: Record<number, React.ReactNode>;
    };
    topToolbarStyle?: React.CSSProperties;
    bottomToolbarStyle?: React.CSSProperties;
  };
}

const SketchCanvas = ({
  image_url,
  handleUpdatePath,
  handleSetMainAction,
  canvasPath,
  drawingOptions,
  inDrawMode,
  sketchCanvasStyle,
  onDrawStart,
  onDrawEnd,
  toolbarOptions,
}: SketchCanvasProps) => {
  //states
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(drawingOptions?.strokeWidth ?? 5);
  const [strokeColor, setStrokeColor] = useState(drawingOptions?.strokeColor ?? "#000000");
  const [sketchOptions, setSketchOptions] = useState<SketchOptions | null>("Pen");
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [isStrokeMenuOpen, setIsStrokeMenuOpen] = useState(false);

  //hooks
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const strokeMenuRef = useRef<HTMLDivElement | null>(null);
  const debouncedUpdatePathRef = useRef<(paths: CanvasPath[]) => void | null>(null);
  const debouncedUpdatePath = useDebounce((paths: CanvasPath[]) => {
    handleUpdatePath(paths);
  }, 300);

  //consts
  const defaultStrokeIcons: Record<number, React.ReactNode> = {
    2: <Stroke1 className="size-6 cursor-pointer fill-gray-500" />,
    5: <Stroke2 className="size-6 cursor-pointer fill-gray-500" />,
    10: <Stroke3 className="size-6 cursor-pointer fill-gray-500" />,
    15: <Stroke4 className="size-6 cursor-pointer fill-gray-500" />,
  };

  const sketchActions: { label: SketchActions; icon: React.ReactNode }[] = [
    // { label: "Cancel", icon: toolbarOptions?.topToolbarIcons?.Cancel ?? <CancelIcon fill="white" /> },
    { label: "Redo", icon: toolbarOptions?.topToolbarIcons?.Redo ?? <RedoIcon fill="white" /> },
    { label: "Undo", icon: toolbarOptions?.topToolbarIcons?.Undo ?? <UndoIcon fill="white" /> },
    { label: "Done", icon: toolbarOptions?.topToolbarIcons?.Done ?? <DoneIcon fill="white" /> },
  ];

  //methods
  function getStrokeLength(points: Point[]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  /**
   * Bounding box intersection check
   * Checks if two paths intersect — but it does so approximately, by comparing their bounding rectangles instead of   their actual curves. (a quick heuristic)
   * @param path1 - Array of points
   * @param path2 - Array of points
   * @returns boolean
   */
  function isPathIntersecting(path1: Point[], path2: Point[]): boolean {
    const getBounds = (pts: Point[]) => {
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      return {
        xMin: Math.min(...xs),
        xMax: Math.max(...xs),
        yMin: Math.min(...ys),
        yMax: Math.max(...ys),
      };
    };

    const b1 = getBounds(path1);
    const b2 = getBounds(path2);

    //standard 2D Axis-Aligned Bounding Box (AABB)
    return b1.xMin < b2.xMax && b1.xMax > b2.xMin && b1.yMin < b2.yMax && b1.yMax > b2.yMin;
  }

  function handleDrawOptions(type: SketchOptions, value?: number | string) {
    switch (type) {
      case "Erase":
        setSketchOptions("Erase");
        canvasRef.current?.eraseMode(true);
        break;
      case "Pen":
        setSketchOptions("Pen");
        canvasRef.current?.eraseMode(false);
        console.log("w value", value);
        setStrokeWidth(value as number);
        setIsStrokeMenuOpen(false);
        break;
      case "pick color":
        setStrokeColor(value as string);
        break;
    }
  }

  function handleSelectedAction(action: SketchActions) {
    switch (action) {
      case "Done":
        exportPaths();
        if (sketchOptions === "Erase") {
          setSketchOptions("Pen");
          canvasRef.current?.eraseMode(false);
        }
        break;
      case "Cancel":
        handleSetMainAction();
        break;
      case "Undo":
        canvasRef.current?.undo();
        break;
      case "Redo":
        canvasRef.current?.redo();
        break;
    }
  }

  const exportPaths = async () => {
    if (canvasRef.current) {
      const paths = await canvasRef.current.exportPaths();
      handleUpdatePath(paths);
    }
    handleSetMainAction();
  };

  // If the stroke is long enough, it checks for path intersections and deletes intersected paths.
  const handleStrokeEnd = async (newStroke: Point[]) => {
    const STROKE_THRESHOLD = 10;
    if (!canvasPath || !newStroke?.length) return;

    const length = getStrokeLength(newStroke);
    if (length < STROKE_THRESHOLD) return;

    const updatedPaths = canvasPath.filter((existingPath) => !isPathIntersecting(existingPath.paths, newStroke));
    if (updatedPaths.length !== canvasPath.length) {
      handleUpdatePath(updatedPaths);
      canvasRef.current?.clearCanvas();
      canvasRef.current?.loadPaths(updatedPaths);
    }
  };

  //Called on a pointer click. It checks if the click is near any path and deletes those.
  const handlePathPointerUp = (e: PointerEvent) => {
    if (sketchOptions !== "Erase" || !canvasPath?.length) return;

    const svg = document.getElementById("current_image") as SVGSVGElement | null;
    if (!svg) return;

    const point = {
      x: e.clientX - svg.getBoundingClientRect().left,
      y: e.clientY - svg.getBoundingClientRect().top,
    };

    const updatedPaths = canvasPath.filter((p) => !isPathIntersecting(p.paths, [point, point]));

    if (updatedPaths.length !== canvasPath.length) {
      handleUpdatePath(updatedPaths);
      canvasRef.current?.clearCanvas();
      canvasRef.current?.loadPaths(updatedPaths);
    }
  };

  useEffect(() => {
    const svg = document.getElementById("current_image") as SVGSVGElement | null;
    if (!svg) return;

    const handleStartDraw = () => {
      setIsDrawing(true);
      onDrawStart?.();
    };

    const handleEndDraw = () => {
      setIsDrawing(false);
      onDrawEnd?.();
    };

    const addListeners = () => {
      svg.addEventListener("pointerdown", handleStartDraw);
      svg.addEventListener("pointerup", handleEndDraw);
      svg.querySelectorAll("path").forEach((path) => path.addEventListener("pointerup", handlePathPointerUp));
    };

    const removeListeners = () => {
      svg.removeEventListener("pointerdown", handleStartDraw);
      svg.removeEventListener("pointerup", handleEndDraw);
      svg.querySelectorAll("path").forEach((path) => path.removeEventListener("pointerup", handlePathPointerUp));
    };

    addListeners();
    const observer = new MutationObserver(() => {
      removeListeners();
      addListeners();
    });

    observer.observe(svg, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      removeListeners();
    };
  }, [canvasPath, sketchOptions]);

  useEffect(() => {
    if (canvasPath && canvasPath.length && canvasRef.current && inDrawMode) {
      canvasRef.current.loadPaths(canvasPath);
    } else {
      canvasRef.current?.clearCanvas();
    }
  }, [canvasPath, inDrawMode]);

  useEffect(() => {
    const canvas = document.getElementById("current_image");
    if (!canvas) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (sketchOptions === "Erase") {
        setPointerPos({ x: e.clientX, y: e.clientY });
      } else {
        setPointerPos(null);
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [sketchOptions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (strokeMenuRef.current && !strokeMenuRef.current.contains(event.target as Node)) {
        setIsStrokeMenuOpen(false);
      }
    }

    if (isStrokeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStrokeMenuOpen]);


  return (
    <>
      <ReactSketchCanvas
        id="current_image"
        key={`${strokeColor}-${strokeWidth}`}
        className={cn("rounded-md", sketchOptions === "Erase" && "cursor-none")}
        style={sketchCanvasStyle}
        width="100%"
        height="100%"
        allowOnlyPointerType={inDrawMode ? "all" : "Pen"}
        preserveBackgroundImageAspectRatio="xMidyMid"
        ref={canvasRef}
        backgroundImage={image_url}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        onStroke={async (path, isEraser) => {
          if (isEraser) {
            handleStrokeEnd(path.paths);
          } else if (canvasRef.current) {
            const paths = await canvasRef.current.exportPaths();
            debouncedUpdatePath(paths);
          }
        }}
      />

      {inDrawMode && !isDrawing && (
        <div
          className={cn(
            "fixed md:absolute top-3 md:-top-25 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2 backdrop-blur-md shadow-md rounded-xl",
            toolbarOptions?.bottomToolbarStyle
          )}
        >
          {/* Color Picker */}
          <ColorPickerButton onChange={(val) => handleDrawOptions("pick color", val)} strokeColor={strokeColor} />

          {/* Eraser */}
          <button
            onClick={() => handleDrawOptions("Erase")}
            className={cn(
              "p-1 rounded-xl border border-transparent hover:border-gray-400",
              sketchOptions === "Erase" ? "bg-blue-300" : "bg-gray-700"
            )}
          >
            {toolbarOptions?.strokeIcons?.eraserIcon ?? (
              <EraseIcon className="cursor-pointer fill-amber-50 hover:fill-gray-800" />
            )}
          </button>

          {/* Stroke Width Dropdown */}
          <div className="relative group" ref={strokeMenuRef}>
            <button
              className="p-1 rounded-xl bg-gray-700 hover:border-gray-400 cursor-pointer"
              onClick={() => setIsStrokeMenuOpen((prev) => !prev)}
            >
              ✏️
            </button>
            {isStrokeMenuOpen && (
              <div className="absolute top-full bg-gray-100 mt-1 left-1/2 -translate-x-1/2 border rounded-md shadow-md p-1 z-50 cursor-pointer">
                {Object.entries(toolbarOptions?.strokeIcons?.strokeWidthIcons ?? defaultStrokeIcons).map(
                  ([w, icon]) => (
                    <button
                      key={w}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrawOptions("Pen", Number(w));
                      }}
                      className={cn(
                        "p-1 block w-full text-left rounded cursor-pointer hover:bg-blue-200",
                        sketchOptions === "Pen" && strokeWidth === Number(w) ? "bg-blue-200" : ""
                      )}
                    >
                      {icon}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Other Drawing Actions */}
          {sketchActions.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => handleSelectedAction(label)}
              className="p-1 rounded-xl bg-gray-700 border border-transparent hover:border-gray-400 cursor-pointer"
            >
              {icon}
            </button>
          ))}
        </div>
      )}

      {sketchOptions === "Erase" && pointerPos && (
        <EraseIcon
          className="fixed z-50 pointer-events-none text-white drop-shadow-xl"
          style={{
            width: `${strokeWidth * 2}px`,
            height: `${strokeWidth * 2}px`,
            left: pointerPos.x - strokeWidth,
            top: pointerPos.y - strokeWidth,
            transition: "left 30ms linear, top 30ms linear",
          }}
        />
      )}
    </>
  );
};

export default SketchCanvas;
