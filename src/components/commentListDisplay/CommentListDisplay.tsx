import { useMetaDataCtx, type MetaData } from "../../pages/ImageDetailsPage";
import CommentInputBox from "../commentInputBox/CommentInputBox";
import OptionIcon from "../../assets/icons/optionsDot.svg?react";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/icons/close.svg?react";
import { cn } from "../../lib/tailwind";
import CustomMenu from "../customMenu/CustomMenu";
import CommentCard from "../commentCard/CommentCard";

const parentCommentOptions = ["Hide Comments", "Delete"] as const;

const commentOptions = ["Edit", "Delete"] as const;

type CommentOption = (typeof commentOptions)[number];

type CommentHandlerMap = {
  [key in CommentOption]: (...args: any[]) => void;
};

interface IProps {
  comments: MetaData[];
  handleDeleteMetaDataById: (id: string) => void;
}

const CommentListDisplay = ({ comments, handleDeleteMetaDataById }: IProps) => {
  //state
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  //hook
  const { curSelectedMetaDataId, handleAddComment } = useMetaDataCtx();
  const endRef = useRef<HTMLDivElement | null>(null);

  //const
  const parentData = comments.find((c) => c.metadata_id === curSelectedMetaDataId);
  if (!parentData) return null;

  const CommentOptionsHandlerMap: CommentHandlerMap = {
    Edit: handleEditComment,
    Delete: handleDeleteMetaDataById,
  };

  //method
  function handleAddSubComment(val: string) {
    handleAddComment(val, "sub");
  }

  function handleOpenOptionMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setMenuAnchor(e.currentTarget);
  } 

  function handleCloseOptionMenu() {
    setMenuAnchor(null);
  }

  function handleGenerateCommentOptions() {
    if (menuAnchor?.dataset.menuType === "parent") {
      return parentCommentOptions;
    } else return commentOptions;
  }

  // function getlistHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
  //   return CommentOptionsHandlerMap[e.currentTarget.id as keyof typeof CommentOptionsHandlerMap]();
  // }

  function getlistHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const option = e.currentTarget.id as keyof typeof CommentOptionsHandlerMap;
    const id = curSelectedMetaDataId ?? "";
    CommentOptionsHandlerMap[option](id);
  }

  function handleEditComment(id: string) {
    console.log("edit hit", id);
    handleCloseOptionMenu();
  }

  useEffect(() => {
    if (comments.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length]);

  return (
    <div className="flex gap-3 relative ">
      <div
        className={cn(
          "bg-white p-1 rounded-t-3xl rounded-br-3xl h-fit",
          parentData.metadata_id === curSelectedMetaDataId ? "border-2 border-blue-400" : "bg-white"
        )}
      >
        <div className="bg-blue-400  text-white p-1 px-2.5 h-fit capitalize rounded-full">
          {parentData.created_by[0]}
        </div>
      </div>
      {/** desktop view menu */}
      <div
        className={cn(
          "bg-white p-2 rounded-md  flex-col gap-2 absolute left-13 hidden md:block",
          curSelectedMetaDataId === parentData.metadata_id ? "z-20" : "z-10"
        )}
      >
        <div className="flex justify-between items-center">
          <span className="border-gray-500 text-xs text-gray-400">Comment</span>
          <button
            data-menu-type="parent"
            // id={`parent_comment_options_${curSelectedMetaDataId}`}
            className="ml-auto  hover:bg-gray-200 rounded-md relative"
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
              handleDeleteMetaDataById={handleDeleteMetaDataById}
              handleEditComment={handleEditComment}
            />
          ))}
          <div ref={endRef}></div>
        </div>

        <CommentInputBox handleInputValue={handleAddSubComment} input_placeholder="Reply" initial_value="" />
      </div>

      {/** mobile view  - when a comment is selected*/}
      <div className="block md:hidden bg-amber-50">comment mobile view</div>

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
