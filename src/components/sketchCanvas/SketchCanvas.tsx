import { useRef, useState } from "react";
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

type SketchActions = "Redo" | "Undo" | "Cancel" | "Done";

const sketchActions = [
  { label: "Cancel", icon: <CancelIcon fill="grey" className="cursor-pointer" /> },
  { label: "Redo", icon: <RedoIcon fill="grey" className="cursor-pointer" /> },
  { label: "Undo", icon: <UndoIcon fill="grey" className="cursor-pointer" /> },
  { label: "Done", icon: <DoneIcon fill="grey" className="cursor-pointer" /> },
];

interface StrokeWidthProps {
  handleStrokeWidthChange: (width: number) => void;
}

const StrokeWidthComponent: React.FC<StrokeWidthProps> = ({ handleStrokeWidthChange }) => {
  const preConfiguredStrokes = [
    { value: 2, icon: <Stroke1 fill="black" className=" cursor-pointer size-7" /> },
    { value: 5, icon: <Stroke2 fill="black" className=" cursor-pointer size-7" /> },
    { value: 10, icon: <Stroke3 fill="black" className=" cursor-pointer size-7" /> },
    { value: 15, icon: <Stroke4 fill="black" className=" cursor-pointer size-7" /> },
  ];

  return (
    <div className="flex flex-col gap-2">
      {preConfiguredStrokes.map((s, i) => (
        <Tooltip key={i} title={`stroke width - ${String(s.value)}`} position="right">
          <button className="bg-gray-200 rounded-xl p-1" onClick={() => handleStrokeWidthChange(s.value)}>
            {s.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

interface IProps {
  image: string;
  handleSetMainAction: () => void;
}
const SketchCanvas = ({ image, handleSetMainAction }: IProps) => {
  //state
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [eraseMode, setEraseMode] = useState(false);
  const [canvasPaths, setCanvasPaths] = useState<CanvasPath[]>([]);

  //hooks
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  //methods
  function handleSelectedAction(actionType: SketchActions) {
    switch (actionType) {
      case "Done":
        handleSetMainAction();
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

  function handleStrokeWidthChange(width: number) {
    setStrokeWidth(width);
  }

  function handleChange(updatedPaths: CanvasPath[]) {
    console.log(updatedPaths);
    setCanvasPaths(updatedPaths);
  }

  function handleErase() {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }

  return (
    <>
      <ReactSketchCanvas
        style={{ width: "100%", height: "100%", position: "relative" }}
        ref={canvasRef}
        backgroundImage={image}
        strokeWidth={strokeWidth}
        onChange={(updatedPaths) => handleChange(updatedPaths)}
      />
      <div className="absolute -right-11 flex flex-col gap-2">
        <Tooltip title={"Erase"} position="right">
          <button
            className={cn("bg-gray-200 rounded-xl p-1 cursor-pointer", eraseMode ? "bg-blue-300" : "bg-gray-200")}
            onClick={handleErase}
          >
            <EraseIcon fill="black" />
          </button>
        </Tooltip>
        <StrokeWidthComponent handleStrokeWidthChange={handleStrokeWidthChange} />
      </div>

      <div className="p-1 absolute -top-12 flex gap-2">
        {sketchActions.map((a, i) => (
          <Tooltip title={a.label} key={i}>
            <button
              id={a.label}
              className={cn("bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100 ")}
              onClick={() => handleSelectedAction(a.label as SketchActions)}
            >
              {a.icon}
            </button>
          </Tooltip>
        ))}
      </div>
    </>
  );
};

export default SketchCanvas;
