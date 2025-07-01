import type { sketchOptions } from "../sketchCanvas/SketchCanvas";
import Tooltip from "../tooltip/Tooltip";

interface ColorPickerProps {
  strokeColor: string;
  handleDrawOptions: (type: sketchOptions, value?: number | string) => void;
}

const StrokeColor: React.FC<ColorPickerProps> = ({ handleDrawOptions, strokeColor }) => {
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

export default StrokeColor;
