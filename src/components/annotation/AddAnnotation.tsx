import { memo } from "react";
import CommentInputBox from "../commentInputBox/CommentInputBox";

interface IProps {
  offsetValues: {
    x: number;
    y: number;
    value: string;
  } | null;
  handleAddMetadata: (val: string, type: "new" | "sub") => void;
}

const AddAnnotation = ({ offsetValues, handleAddMetadata }: IProps) => {
  if (offsetValues === null) return;

  function handleAddNewComment(val: string) {
    handleAddMetadata(val, "new");
  }

  return (
    <div
      className=" absolute lg:flex gap-2 -translate-y-full min-w-[15rem] hidden"
      style={offsetValues ? { top: `${offsetValues.y}%`, left: `${offsetValues.x}%` } : {}}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-blue-400 rounded-t-2xl rounded-br-2xl text-white p-1 px-2.5 h-fit capitalize mt-auto">U</div>

      {/** desktop view */}
      <div className="gap-2 bg-white p-1 rounded-xl hidden md:block">
        <CommentInputBox handleInputValue={handleAddNewComment} input_placeholder="Add a comment" initial_value="" />
      </div>
    </div>
  );
};

export default memo(AddAnnotation);
