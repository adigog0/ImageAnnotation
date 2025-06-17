import React from "react";
import { cn } from "../../lib/tailwind";
import CommentIcon from "../../assets/icons/commentIcon.svg?react";
import NearestTagIcon from "../../assets/icons/nearestTag.svg?react";
import VisibilityOffIcon from "../../assets/icons/visibility-off.svg?react";
import DrawIcon from "../../assets/icons/draw.svg?react";
import SaveIcon from "../../assets/icons/save.svg?react";

export type ActionTypes = "Add Comment" | "Nearest Tags" | "Hide Comments" | "Draw" | "Save Comments";

interface ActionToolbarProps {
  selectedActions: ActionTypes | null;
  handleSelectedAction: (actionType: ActionTypes) => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ handleSelectedAction, selectedActions }) => {
  return (
    <div className="flex gap-2">
      <button
        id="comment"
        className={cn(
          "bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100",
          selectedActions && selectedActions === "Add Comment" ? "bg-blue-200" : "bg-white"
        )}
        onClick={(e) => handleSelectedAction("Add Comment")}
      >
        <CommentIcon fill="grey" className="cursor-pointer" />
      </button>

      <button
        id="tag"
        className="bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100"
        onClick={(e) => handleSelectedAction("Nearest Tags")}
      >
        <NearestTagIcon fill="grey" className="cursor-pointer" />
      </button>

      <button
        id="tag"
        className="bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100"
        onClick={(e) => handleSelectedAction("Hide Comments")}
      >
        <VisibilityOffIcon fill="grey" className="cursor-pointer" />
      </button>

      <button
        id="tag"
        className="bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100"
        onClick={(e) => handleSelectedAction("Draw")}
      >
        <DrawIcon fill="grey" className="cursor-pointer" />
      </button>

      <button
        id="tag"
        className="bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100"
        onClick={(e) => handleSelectedAction("Save Comments")}
      >
        <SaveIcon fill="grey" className="cursor-pointer" />
      </button>
    </div>
  );
};

export default ActionToolbar;
