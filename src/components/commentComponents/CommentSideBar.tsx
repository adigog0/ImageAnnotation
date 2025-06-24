import { forwardRef } from "react";
import CommentCard from "../commentCard/CommentCard";
import SideBar from "../SideBar/SideBar";
import { useMetaDataCtx } from "../../pages/ImageDetailsPage";

interface CommentSideBarProps {
  handleDeleteMetaDataById: (id: string) => void;
  handleEditMetaData: () => void;
  getTotalSubCommentCount: (parentId: string) => number;
  handleClickMetaData: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}

const CommentSideBar = forwardRef<HTMLDivElement, CommentSideBarProps>(
  ({ handleDeleteMetaDataById, handleEditMetaData, getTotalSubCommentCount, handleClickMetaData }, ref) => {
    const { curSelectedMetaDataId, metaData } = useMetaDataCtx();
    return (
      <SideBar width="18rem" className="hidden md:block absolute z-20 bg-blue-50">
        <div className="h-full shadow-md" ref={ref}>
          <div className="p-3 border-b border-gray-300 text-sm font-semibold">Comments</div>
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
                  handleDeleteMetaDataById={handleDeleteMetaDataById}
                  handleEditComment={handleEditMetaData}
                  getTotalSubCommentCount={getTotalSubCommentCount}
                  handleClickMetaData={handleClickMetaData}
                />
              ))}
          </div>
        </div>
      </SideBar>
    );
  }
);

export default CommentSideBar;
