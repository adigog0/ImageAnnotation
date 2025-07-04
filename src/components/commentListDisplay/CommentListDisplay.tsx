import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/tailwind";
import CustomMenu from "../customMenu/CustomMenu";
import CommentCard from "../commentCard/CommentCard";
import CommentInputBox from "../commentInputBox/CommentInputBox";
import type { MetaData } from "../../types/constant";
import { useAnnotatorContext } from "../../context/AnnotatorContext";
import CloseIcon from "../../assets/icons/close.svg?react";
import OptionIcon from "../../assets/icons/optionsDot.svg?react";

const parentCommentOptions = ["Hide Comments", "Delete"] as const;
const commentOptions = ["Edit", "Delete"] as const;

type CommentOption = (typeof commentOptions)[number];
type CommentHandlerMap = {
  [key in CommentOption]: (id: string) => void;
};

interface CommentListDisplayProps {
  comments: MetaData[];
}

const CommentListDisplay = ({ comments }: CommentListDisplayProps) => {
  //states
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  //hooks
  const endRef = useRef<HTMLDivElement | null>(null);
  const { curSelectedMetaDataId, handleDeleteMetaData, onEdit, handleAddComment } = useAnnotatorContext();

  //const
  const CommentOptionsHandlerMap: CommentHandlerMap = {
    Edit: handleEditComment,
    Delete: handleDeleteMetaData,
  };

  //methods
  function handleEditComment(id: string) {
    onEdit(id);
    handleCloseOptionMenu();
  }

  function handleOpenOptionMenu(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setMenuAnchor(e.currentTarget);
  }

  function handleCloseOptionMenu() {
    setMenuAnchor(null);
  }

  function handleGenerateCommentOptions() {
    return menuAnchor?.dataset.menuType === "parent" ? parentCommentOptions : commentOptions;
  }

  function handleAddSubComment(val: string) {
    handleAddComment(val, "sub");
  }

  const getlistHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    const option = e.currentTarget.id as keyof typeof CommentOptionsHandlerMap;
    const id = curSelectedMetaDataId ?? "";
    CommentOptionsHandlerMap[option](id);
  };

  useEffect(() => {
    if (comments.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length]);

  const parentData = comments.find((c) => c.metadata_id === curSelectedMetaDataId);
  if (!parentData) return null;

  return (
    <div className="flex gap-3 relative ">

      {/** desktop view menu */}
      <div
        className={cn(
          "bg-white p-2 rounded-md  flex-col gap-2 absolute hidden lg:block",
          curSelectedMetaDataId === parentData.metadata_id ? "z-20" : "z-10"
        )}
      >
        <div className="flex justify-between items-center">
          <span className="border-gray-500 text-xs text-gray-400">Comment</span>
          <button
            data-menu-type="parent"
            // id={`parent_comment_options_${curSelectedMetaDataId}`}
            className="ml-auto  hover:bg-gray-200 rounded-md relative cursor-pointer"
            onClick={handleOpenOptionMenu}
          >
            <OptionIcon className="ml-auto size-4 cursor-pointer" fill="gray" />
          </button>
          <button className=" ml-1 hover:bg-gray-200 rounded-md">
            <CloseIcon fill="gray" className="size-4" />
          </button>
        </div>
        <div className="border-b border-gray-300"></div>
        <div className="max-h-90 overflow-auto">
          {comments.map((c) => (
            <CommentCard
              key={c.metadata_id}
              type="fromTag"
              comment={c}
              curSelectedMetaDataId={curSelectedMetaDataId ?? ""}
            />
          ))}
          <div ref={endRef}></div>
        </div>

        <CommentInputBox handleInputValue={handleAddSubComment} input_placeholder="Reply" initial_value="" />
      </div>

      {/** mobile view  - when a comment is selected*/}
      <div className="max-h-90 overflow-auto block lg:hidden w-full">
        {comments.map((c) => (
          <CommentCard
            key={c.metadata_id}
            type="fromTag"
            comment={c}
            curSelectedMetaDataId={curSelectedMetaDataId ?? ""}
          />
        ))}
        <div ref={endRef}></div>
        <CommentInputBox handleInputValue={handleAddSubComment} input_placeholder="Reply" initial_value="" />
      </div>

      <CustomMenu handleClose={handleCloseOptionMenu} buttonRef={menuAnchor}>
        <div className="flex flex-col w-full">
          {handleGenerateCommentOptions().map((c) => (
            <span key={c} id={c} className="text-xs hover:bg-gray-200 py-1 px-5 " onClick={(e) => getlistHandler(e)}>
              {c}
            </span>
          ))}
        </div>
      </CustomMenu>
    </div>
  );
};

export default CommentListDisplay;
