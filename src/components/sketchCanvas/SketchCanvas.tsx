import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef, type CanvasPath } from "react-sketch-canvas";
import RedoIcon from "../../assets/icons/redo.svg?react";
import UndoIcon from "../../assets/icons/undo.svg?react";
import CancelIcon from "../../assets/icons/cancel.svg?react";
import Tooltip from "../tooltip/Tooltip";
import { cn } from "../../lib/tailwind";
import DoneIcon from "../../assets/icons/done.svg?react";
import Stroke1 from "../../assets/icons/stroke1.svg?react";
import Stroke2 from "../../assets/icons/stroke2.svg?react";
import Stroke3 from "../../assets/icons/stroke3.svg?react";
import Stroke4 from "../../assets/icons/stroke4.svg?react";
import EraseIcon from "../../assets/icons/Eraser.svg?react";
import ColorPicker from "../../assets/icons/colorPicker.svg?react";
import type { ActionTypes } from "../actionToolBar/ActionToolbar";
import { useMetaDataCtx } from "../../pages/ImageDetailsPage";

type SketchActions = "Redo" | "Undo" | "Cancel" | "Done";
type sketchOptions = "Erase" | "Pen" | "pick color";

const sketchActions = [
  { label: "Cancel", icon: <CancelIcon fill="grey" className="cursor-pointer" /> },
  { label: "Redo", icon: <RedoIcon fill="grey" className="cursor-pointer" /> },
  { label: "Undo", icon: <UndoIcon fill="grey" className="cursor-pointer" /> },
  { label: "Done", icon: <DoneIcon fill="grey" className="cursor-pointer" /> },
];

interface StrokeWidthProps {
  handleDrawOptions: (type: sketchOptions, value?: number | string) => void;
  selectedWidth: number;
  sketchOptions: sketchOptions | null;
}

const StrokeWidthComponent: React.FC<StrokeWidthProps> = ({ handleDrawOptions, selectedWidth, sketchOptions }) => {
  const preConfiguredStrokes = [
    { value: 2, icon: <Stroke1 fill="black" className=" cursor-pointer size-6" /> },
    { value: 5, icon: <Stroke2 fill="black" className=" cursor-pointer size-6" /> },
    { value: 10, icon: <Stroke3 fill="black" className=" cursor-pointer size-6" /> },
    { value: 15, icon: <Stroke4 fill="black" className=" cursor-pointer size-6" /> },
  ];

  return (
    <div className="flex gap-2">
      {preConfiguredStrokes.map((s, i) => (
        <Tooltip key={i} title={`stroke width - ${String(s.value)}`}>
          <button
            className={cn(
              "rounded-xl p-1 outline outline-transparent hover:outline hover:outline-gray-500",
              sketchOptions === "Pen" && selectedWidth === s.value ? "bg-blue-300" : "bg-gray-200 "
            )}
            onClick={() => handleDrawOptions("Pen", s.value)}
          >
            {s.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

interface ColorPickerProps {
  strokeColor: string;
  handleDrawOptions: (type: sketchOptions, value?: number | string) => void;
}

const StrokeColorComponent: React.FC<ColorPickerProps> = ({ handleDrawOptions, strokeColor }) => {
  return (
    <Tooltip title="Pick color">
      <input
        type="color"
        style={{}}
        className="w-8 rounded-lg cursor-pointer outline outline-transparent hover:outline hover:outline-gray-500"
        id="strokeColorPicker"
        value={strokeColor}
        onChange={(e) => handleDrawOptions("pick color", e.target.value)}
      />
    </Tooltip>
  );
};

interface IProps {
  image: string;
  handleSetMainAction: () => void;
  handleUpdatePath: (path: CanvasPath[]) => void;
  canvasPath: CanvasPath[] | null;
}
const SketchCanvas = ({ image, handleSetMainAction, handleUpdatePath, canvasPath }: IProps) => {
  //state
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [sketchOptions, setSketchOptions] = useState<sketchOptions | null>("Pen");

  //hooks
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const { selectedAction } = useMetaDataCtx();

  //methods
  function handleSelectedAction(actionType: SketchActions) {
    switch (actionType) {
      case "Done":
        handleExportPath();
        break;
      case "Cancel":
        handleSetMainAction();
        break;
      case "Redo":
        canvasRef.current?.redo();
        break;
      case "Undo":
        canvasRef.current?.undo();
        break;
    }
  }

  const handleExportPath = async () => {
    if (canvasRef.current) {
      try {
        const paths = await canvasRef.current.exportPaths();
        handleUpdatePath(paths);
        console.log("Exported Paths:", paths);
        // You can now save it or send to backend
      } catch (error) {
        console.error("Export failed:", error);
      }
    }
    handleSetMainAction();
  };

  function handleDrawOptions(type: sketchOptions, value?: number | string) {
    switch (type) {
      case "Erase":
        handleErase();
        break;
      case "Pen":
        handleStrokeWidthChange(value as number);
        break;
      case "pick color":
        handleStrokeColor(value as string);
        break;
      default:
        break;
    }
  }

  function handleStrokeWidthChange(width: number) {
    setSketchOptions("Pen");
    canvasRef.current?.eraseMode(false);
    setStrokeWidth(width);
  }

  function handleErase() {
    setSketchOptions("Erase");
    canvasRef.current?.eraseMode(true);
  }

  function handleStrokeColor(color: string) {
    setStrokeColor(color);
  }

  useEffect(() => {
    if (canvasPath && canvasPath.length && canvasRef.current && selectedAction === "Draw") {
      canvasRef.current.loadPaths(canvasPath);
    } else {
      canvasRef.current?.clearCanvas();
    }
  }, [canvasPath, selectedAction]);

  useEffect(() => {
    const svg = document.getElementById("current_image") as SVGSVGElement | null;

    if (!svg) return;

    const addListeners = () => {
      const paths = svg.querySelectorAll("path");
      svg.addEventListener("pointerdown", handleStartDraw);
      svg.addEventListener("touchstart", handleStartDraw);
      svg.addEventListener("touchend", handleEndDraw);
      paths.forEach((path) => {
        path.addEventListener("pointerup", handleEndDraw);
      });
    };

    const handleStartDraw = () => setIsDrawing(true);
    const handleEndDraw = () => setIsDrawing(false);

    // Initial run
    addListeners();

    // Watch for new paths being added
    const observer = new MutationObserver(() => {
      addListeners();
    });

    observer.observe(svg, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      svg.removeEventListener("pointerdown", handleStartDraw);
      svg.addEventListener("touchstart", handleStartDraw);
      svg.addEventListener("touchend", handleEndDraw);
      svg.querySelectorAll("path").forEach((path) => {
        path.removeEventListener("pointerup", handleEndDraw);
      });
    };
  }, []);

  return (
    <>
      <ReactSketchCanvas
        id="current_image"
        width="100%"
        height="100%"
        allowOnlyPointerType={selectedAction === "Draw" ? "all" : "Pen"}
        preserveBackgroundImageAspectRatio="xMidyMid"
        ref={canvasRef}
        backgroundImage={image}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
      />
      {selectedAction === "Draw" && (
        <>
          <div
            className={cn(
              "absolute bottom-0 md:-bottom-16 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-300 ease-in-out",
              isDrawing ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
            )}
          >
            <StrokeColorComponent handleDrawOptions={handleDrawOptions} strokeColor={strokeColor} />
            <Tooltip title="Erase">
              <button
                className={cn(
                  "bg-gray-200 rounded-xl p-1 cursor-pointer outline outline-transparent hover:outline hover:outline-gray-500",
                  sketchOptions === "Erase" ? "bg-blue-300" : "bg-gray-200"
                )}
                onClick={() => handleDrawOptions("Erase")}
              >
                <EraseIcon fill="black" />
              </button>
            </Tooltip>
            <StrokeWidthComponent
              handleDrawOptions={handleDrawOptions}
              selectedWidth={strokeWidth}
              sketchOptions={sketchOptions}
            />
          </div>
          <div
            className={cn(
              "p-1 absolute top-0 md:-top-12 flex gap-2 transition-all duration-300 ease-in-out",
              isDrawing ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
            )}
          >
            {sketchActions.map((a, i) => (
              <Tooltip title={a.label} key={i}>
                <button
                  id={a.label}
                  className={cn("bg-white border border-gray-400 p-1 rounded-xl hover:bg-blue-100 ")}
                  onClick={() => handleSelectedAction(a.label as SketchActions)}
                >
                  {a.icon}
                </button>
              </Tooltip>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SketchCanvas;
