import { memo } from "react";
import CommentInputBox from "../commentInputBox/CommentInputBox";

interface IProps {
  offsetValues: {
    x: number;
    y: number;
    value: string;
  } | null;
  handleAddMetadata: (metadata: string) => void;
}

const AddAnnotation = ({ offsetValues, handleAddMetadata }: IProps) => {
  if (offsetValues === null) return;

  return (
    <div
      className=" absolute flex gap-2 -translate-y-full"
      style={offsetValues ? { top: `${offsetValues.y}%`, left: `${offsetValues.x}%` } : {}}
    >
      <div className="bg-blue-400 rounded-t-2xl rounded-br-2xl text-white p-1 px-3 h-fit capitalize mt-auto">t</div>
      <div className="flex gap-2 bg-white p-1 rounded-xl">
        <CommentInputBox handleInputValue={handleAddMetadata} input_placeholder="Add a comment" initial_value="" />
      </div>
      {/* <div className=" flex gap-2 items-center">
        <CommentBox handleInputValue={()=>{}} input_placeholder="Add a comment" />
        <button className="border border-transparent cursor-pointer hover:border-gray-400 bg-gray-300 p-1 rounded-full">
          <SendIcon fill="white" />
        </button>
      </div> */}
    </div>
  );
};

export default memo(AddAnnotation);
