import React from "react";
import { cn } from "../../lib/tailwind";
import CommentIcon from "../../assets/icons/commentIcon.svg?react";
import NearestTagIcon from "../../assets/icons/nearestTag.svg?react";
import VisibilityOffIcon from "../../assets/icons/visibility-off.svg?react";
import DrawIcon from "../../assets/icons/draw.svg?react";
import SaveIcon from "../../assets/icons/save.svg?react";
import Tooltip from "../tooltip/Tooltip";
import VisibilityOnIcon from "../../assets/icons/visibility_on.svg?react";
import HidePathsIcon from "../../assets/icons/noDraw.svg?react";
import ViewAllCommentsIcon from "../../assets/icons/viewAll.svg?react";
import { useMetaDataCtx } from "../../pages/ImageDetailsPage";

export type ActionTypes =
  | "Add comment"
  | "Nearest tags"
  | "Hide comments"
  | "Draw"
  | "Save comments"
  | "Hide Paths"
  | "All comments";

interface ActionToolbarProps {
  handleSelectedAction: (actionType: ActionTypes) => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ handleSelectedAction }) => {
  const { selectedAction } = useMetaDataCtx();
  //const
  const ActionArr = [
    { label: "All comments", icon: <ViewAllCommentsIcon fill="grey" className="cursor-pointer" /> },
    { label: "Add comment", icon: <CommentIcon fill="grey" className="cursor-pointer" /> },
    { label: "Nearest tags", icon: <NearestTagIcon fill="grey" className="cursor-pointer" /> },
    {
      label: "Hide comments",
      icon:
        selectedAction === null || selectedAction !== "Hide comments" ? (
          <VisibilityOnIcon fill="grey" className="cursor-pointer" />
        ) : (
          <VisibilityOffIcon fill="grey" className="cursor-pointer" />
        ),
    },
    { label: "Draw", icon: <DrawIcon fill="grey" className="cursor-pointer" /> },
    { label: "Hide Paths", icon: <HidePathsIcon fill="grey" className="cursor-pointer" /> },
    { label: "Save comments", icon: <SaveIcon fill="grey" className="cursor-pointer" /> },
  ];

  //methods
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    handleSelectedAction(e.currentTarget.id as ActionTypes);
  }

  return (
    <div className="flex gap-2">
      {ActionArr.map((a, i) => (
        <Tooltip title={a.label} key={i}>
          <button
            id={a.label}
            className={cn(
              "bg-white border border-gray-400 p-1.5 rounded-xl hover:bg-blue-100 ",
              selectedAction && selectedAction !== "Save comments" && selectedAction === a.label
                ? "bg-blue-200"
                : "bg-white"
            )}
            onClick={(e) => handleClick(e)}
          >
            {a.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ActionToolbar;
