import type { sketchOptions } from "../sketchCanvas/SketchCanvas";
import Stroke1 from "../../assets/icons/stroke1.svg?react";
import Stroke2 from "../../assets/icons/stroke2.svg?react";
import Stroke3 from "../../assets/icons/stroke3.svg?react";
import Stroke4 from "../../assets/icons/stroke4.svg?react";
import Tooltip from "../tooltip/Tooltip";
import { cn } from "../../lib/tailwind";

interface StrokeWidthProps {
  handleDrawOptions: (type: sketchOptions, value?: number | string) => void;
  selectedWidth: number;
  sketchOptions: sketchOptions | null;
}

const StrokeWidth: React.FC<StrokeWidthProps> = ({ handleDrawOptions, selectedWidth, sketchOptions }) => {
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

export default StrokeWidth;
