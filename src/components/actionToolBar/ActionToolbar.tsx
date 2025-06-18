import React from "react";
import { cn } from "../../lib/tailwind";
import CommentIcon from "../../assets/icons/commentIcon.svg?react";
import NearestTagIcon from "../../assets/icons/nearestTag.svg?react";
import VisibilityOffIcon from "../../assets/icons/visibility-off.svg?react";
import DrawIcon from "../../assets/icons/draw.svg?react";
import SaveIcon from "../../assets/icons/save.svg?react";
import Tooltip from "../tooltip/Tooltip";
import VisibilityOnIcon from "../../assets/icons/visibility_on.svg?react";

export type ActionTypes = "Add comment" | "Nearest tags" | "Hide comments" | "Draw" | "Save comments";

interface ActionToolbarProps {
  selectedActions: ActionTypes | null;
  handleSelectedAction: (actionType: ActionTypes) => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ handleSelectedAction, selectedActions }) => {
  
  const ActionArr = [
    { label: "Add comment", icon: <CommentIcon fill="grey" className="cursor-pointer" /> },
    { label: "Nearest tags", icon: <NearestTagIcon fill="grey" className="cursor-pointer" /> },
    {
      label: "Hide comments",
      icon:
        selectedActions === null || selectedActions !== "Hide comments" ? (
          <VisibilityOnIcon fill="grey" className="" />
        ) : (
          <VisibilityOffIcon fill="grey" className="cursor-pointer" />
        ),
    },
    { label: "Draw", icon: <DrawIcon fill="grey" className="cursor-pointer" /> },
    { label: "Save comments", icon: <SaveIcon fill="grey" className="cursor-pointer" /> },
  ];

  return (
    <div className="flex gap-2">
      {ActionArr.map((a, i) => (
        <Tooltip title={a.label} key={i}>
          <button
            id={a.label}
            className={cn(
              "bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100 ",
              selectedActions && selectedActions === a.label ? "bg-blue-200" : "bg-white"
            )}
            onClick={() => handleSelectedAction(a.label as ActionTypes)}
          >
            {a.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ActionToolbar;
