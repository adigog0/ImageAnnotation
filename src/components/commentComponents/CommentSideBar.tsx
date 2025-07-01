import { forwardRef } from "react";
import CommentCard from "../commentCard/CommentCard";
import SideBar from "../SideBar/SideBar";
import { useAnnotatorContext } from "../../context/AnnotatorContext";
import CancelIcon from "../../assets/icons/cancel.svg?react";

interface CommentSideBarProps {
  getTotalSubCommentCount: (parentId: string) => number;
  onClickMetaData: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  commentSidebarStyle?: React.CSSProperties;
  commentOptionMenuStyle?: React.CSSProperties;
  renderHeader?: React.ReactNode;
}

const CommentSideBar = forwardRef<HTMLDivElement, CommentSideBarProps>(
  ({ getTotalSubCommentCount, onClickMetaData, commentSidebarStyle, commentOptionMenuStyle, renderHeader }, ref) => {
    const { curSelectedMetaDataId, metaData, setSelectedAction, setCurSelectedMetaDataId } = useAnnotatorContext();

    //methods
    function handleCloseSideBar() {
      setSelectedAction(null);
      if (curSelectedMetaDataId) {
        setCurSelectedMetaDataId(null);
      }
    }

    return (
      <SideBar className={`hidden md:block absolute z-20 bg-blue-50 h-full`} style={commentSidebarStyle}>
        <div className="h-full shadow-md" ref={ref}>
          {renderHeader || (
            <div className="p-3 border-b border-gray-300  flex items-center justify-between">
              <span className="text-sm font-semibold">Comments</span>
              <button className="hover:bg-gray-300 rounded-full p-0.5" onClick={handleCloseSideBar}>
                <CancelIcon fill="black" className="size-4 cursor-pointer" />
              </button>
            </div>
          )}
          <div className="p-3 gap-5 flex flex-col">
            <input
              placeholder="Search"
              className="w-full h-full outline-none border border-gray-300 py-1 px-2 rounded-lg"
            />
            {metaData
              .filter((c) => c.parent_id === null)
              .map((c) => (
                <CommentCard
                  key={c.metadata_id}
                  type="fromList"
                  comment={c}
                  curSelectedMetaDataId={curSelectedMetaDataId ?? ""}
                  getTotalSubCommentCount={getTotalSubCommentCount}
                  onClickMetaData={onClickMetaData}
                  commentOptionMenuStyle={commentOptionMenuStyle}
                />
              ))}
          </div>
        </div>
      </SideBar>
    );
  }
);

export default CommentSideBar;
