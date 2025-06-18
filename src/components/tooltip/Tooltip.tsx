// Tooltip.tsx
import React, { useState } from "react";

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({ title, children, position = "top" }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={`absolute z-10 px-2 py-1 text-sm text-white bg-gray-400 rounded-md whitespace-nowrap ${positionClasses[position]}`}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
