import { useEffect, useRef, useState } from "react";
import type { CanvasPath } from "react-sketch-canvas";
import { useMetaDataCtx } from "../../pages/ImageDetailsPage";

interface PathOverlayProps {
  paths: CanvasPath[];
  canvasWidth: number;
  canvasHeight: number;
  denormalize: (point: { x: number; y: number }) => { x: number; y: number };
  hideAllPaths: boolean;
}

const PathOverlay = ({ paths, canvasWidth, canvasHeight, denormalize, hideAllPaths }: PathOverlayProps) => {
  //states
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  // const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  //hook
  const pathRef = useRef<SVGPathElement | null>(null);

  //methods
  function getPathD(points: { x: number; y: number }[]) {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  }

  //lifecycle
  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     const clickedInSVGContainer = pathRef.current?.contains(e.target as Node);
  //     if (!clickedInSVGContainer) {
  //       setContextMenu(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <div className="absolute top-0 left-0" style={{ width: canvasWidth, height: canvasHeight }}>
      <svg width={canvasWidth} height={canvasHeight} className="w-full h-full relative">
        {!hideAllPaths &&
          paths.map((path, index) => {
            const denormPoints = path.paths.map(denormalize);
            const d = getPathD(denormPoints);
            const isHovered = hoveredIndex === index;
            return (
              <path
                ref={pathRef}
                key={index}
                d={d}
                stroke={isHovered ? "red" : path.strokeColor || "black"}
                strokeWidth={path.strokeWidth || 2}
                fill="none"
                style={{
                  cursor: "pointer",
                  pointerEvents: "stroke",
                }}
                onMouseEnter={(e) => {
                  const container = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (container) {
                    setTooltipPos({
                      x: e.clientX - container.left,
                      y: e.clientY - container.top,
                    });
                  }
                  setHoveredIndex(index);
                }}
                onMouseMove={(e) => {
                  const container = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (container) {
                    setTooltipPos({
                      x: e.clientX - container.left,
                      y: e.clientY - container.top,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltipPos(null);
                }}
                onClick={(e) => {
                  const container = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (container) {
                    setTooltipPos({
                      x: e.clientX - container.left,
                      y: e.clientY - container.top,
                    });
                    setHoveredIndex(index);
                  }
                }}
              />
            );
          })}

        {/* {contextMenu && (
          <foreignObject x={contextMenu.x} y={contextMenu.y} width={120} height={120}>
            <div
              className="bg-black rounded-xl p-2 text-white border border-white"
              // xmlns="http://www.w3.org/1999/xhtml"
              // {...({
              //   xmlns: "http://www.w3.org/1999/xhtml",
              // } as any)}
              
              onClick={(e)=>console.log("clicked div in svg",e)}
            >
              <div
                onClick={(e) => console.log("delete", e)}
                className="text-[0.8rem] hover:bg-blue-400 p-1 font-medium cursor-pointer"
              >
                Delete
              </div>
              <div
                onClick={(e) => handleHideAllPaths(e)}
                className="text-[0.8rem] hover:bg-blue-400 p-1  font-medium cursor-pointer"
              >
                Hide paths
              </div>
            </div>
          </foreignObject>
        )} */}
      </svg>
      {tooltipPos && hoveredIndex !== null && (
        <div
          className="absolute bg-black text-white text-xs rounded px-2 py-1"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(5px, 5px)",
            pointerEvents: "none",
          }}
        >
          Path #{hoveredIndex + 1}
        </div>
      )}
    </div>
  );
};

export default PathOverlay;
