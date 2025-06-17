import { format } from "date-fns";
import OptionIcon from "../../assets/icons/optionsDot.svg?react";
import { cn } from "../../lib/tailwind";
import type { MetaData } from "../../pages/ImageDetailsPage";
import CustomMenu from "../customMenu/CustomMenu";
import { useState } from "react";

const parentCommentOptions = ["Hide comment", "Delete"] as const;
const commentOptions = ["Edit", "Delete"] as const;

type CommentOption = (typeof commentOptions)[number];
type CommentHandlerMap = {
  [key in CommentOption]: (...args: any[]) => void;
};

interface CommentCardProps {
  comment: MetaData;
  type: "fromList" | "fromTag";
  curSelectedMetaDataId: string;
  handleClickMetaData?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  getTotalSubCommentCount?: (id: string) => number;
  handleDeleteMetaDataById: (id: string) => void;
  handleEditComment: (id: string) => void;
}

const CommentCard = ({
  comment,
  curSelectedMetaDataId,
  handleClickMetaData,
  getTotalSubCommentCount,
  handleEditComment,
  handleDeleteMetaDataById,
  type,
}: CommentCardProps) => {
  const { metadata_id, created_by, created_at, metadata_value } = comment;

  //states
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  //const
  const CommentOptionsHandlerMap: CommentHandlerMap = {
    Edit: handleEditComment,
    Delete: handleDeleteMetaDataById,
  };

  //methods

  function handleOpenOptionMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setMenuAnchor(e.currentTarget);
  }

  function handleCloseOptionMenu() {
    setMenuAnchor(null);
  }

  function handleGenerateCommentOptions() {
    if (menuAnchor && menuAnchor.id.startsWith("parent_comment_options")) {
      return parentCommentOptions;
    } else return commentOptions;
  }

  function getlistHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    return CommentOptionsHandlerMap[e.currentTarget.id as keyof typeof CommentOptionsHandlerMap]();
  }

  return (
    <>
      <div
        className={cn(
          "p-2 rounded-md cursor-pointer",
          metadata_id === curSelectedMetaDataId && type === "fromList" ? "bg-blue-100" : "bg-white"
        )}
        onClick={(e) => handleClickMetaData && handleClickMetaData(e, metadata_id)}
      >
        <div className="flex gap-2.5">
          <div className="bg-blue-400 text-white p-1 px-2.5 h-fit capitalize rounded-full">{created_by[0]}</div>

          <div className="text-black overflow-hidden w-full">
            <div className="flex items-center">
              <span className="text-[0.8rem] font-semibold mr-1">{created_by}</span>
              <span className="text-[0.6rem] text-gray-400">{format(created_at, "dd MMMM yyyy")}</span>
              <button
                id={metadata_id}
                name="sub_comment_options"
                className="ml-auto hover:bg-gray-200 rounded-md relative"
                onClick={handleOpenOptionMenu}
              >
                <OptionIcon className="ml-auto size-4 cursor-pointer" fill="black" />
              </button>
            </div>
            <span className="text-[0.8rem]">{metadata_value}</span>
          </div>
        </div>

        {getTotalSubCommentCount && getTotalSubCommentCount(metadata_id) > 0 && (
          <span className="text-[11px] text-blue-500 font-semibold">
            {getTotalSubCommentCount(metadata_id)} Replies
          </span>
        )}
      </div>
      <CustomMenu handleClose={handleCloseOptionMenu} buttonRef={menuAnchor}>
        <div className="flex flex-col ">
          {handleGenerateCommentOptions().map((c) => (
            <span
              key={c}
              id={c}
              className="text-xs hover:bg-gray-200 py-1 px-5 w-full"
              onClick={(e) => getlistHandler(e)}
            >
              {c}
            </span>
          ))}
        </div>
      </CustomMenu>
    </>
  );
};

export default CommentCard;
