import { memo, useState } from "react";
import CommentInputBox from "../commentInputBox/CommentInputBox";
import BottomCommentMenu from "../bottomContentMenu/BottomContentMenu";

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

  //state
  const [closeMenu, setCloseMenu] = useState(false);

  //method

  function handleOpenBottomMenu() {
    setCloseMenu(true);
  }

  function handleCloseBottomMenu() {
    setCloseMenu(false);
  }

  return (
    <div
      className=" absolute flex gap-2 -translate-y-full"
      style={offsetValues ? { top: `${offsetValues.y}%`, left: `${offsetValues.x}%` } : {}}
    >
      <div
        className="bg-blue-400 rounded-t-2xl rounded-br-2xl text-white p-1 px-2.5 h-fit capitalize mt-auto"
        onClick={handleOpenBottomMenu}
      >
        U
      </div>

      {/** desktop view */}
      <div className="gap-2 bg-white p-1 rounded-xl hidden md:block">
        <CommentInputBox handleInputValue={handleAddMetadata} input_placeholder="Add a comment" initial_value="" />
      </div>

      {/** mobile view */}
      <BottomCommentMenu isOpen={closeMenu} handleCloseMenu={handleCloseBottomMenu} />
    </div>
  );
};

export default memo(AddAnnotation);
