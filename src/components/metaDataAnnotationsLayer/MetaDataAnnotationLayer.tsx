import { format } from "date-fns";
import { useMetaDataCtx } from "../../pages/ImageDetailsPage";
import { cn } from "../../lib/tailwind";
import CommentListDisplay from "../commentListDisplay/CommentListDisplay";

interface IProps {
  handleClickMetaData: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => void;
}

const MetaDataAnnotationLayer = ({ handleClickMetaData }: IProps) => {
  //const
  const { curSelectedMetaDataId, metaData, setMetaData } = useMetaDataCtx();

  //methods
  function handleGetAllSubComments() {
    if (curSelectedMetaDataId) {
      const modifiedArr = metaData.filter(
        (v) => v.metadata_id === curSelectedMetaDataId || v.parent_id === curSelectedMetaDataId
      );
      return modifiedArr;
    }
    return [];
  }

  function handleOnDragEnd(e: React.DragEvent<HTMLDivElement>) {
    const currentImage = document.getElementById("current_image");
    const draggedElemId = e.currentTarget.id.split("_")[2];
    const curMetaDataIndex = metaData.findIndex((v) => v.metadata_id === draggedElemId);

    if (currentImage && curMetaDataIndex !== -1) {
      const rect = currentImage.getBoundingClientRect();

      // Check if drop is inside image
      const isInside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!isInside) {
        console.log("Drop outside image — ignoring.");
        return;
      }
      // const x = e.clientX - Math.round(rect.left);
      // const y = e.clientY - Math.round(rect.top);

      const x = ((e.clientX - Math.round(rect.left)) / rect.width) * 100;
      const y = ((e.clientY - Math.round(rect.top)) / rect.height) * 100;

      const updatedMetaData = [...metaData];

      updatedMetaData[curMetaDataIndex] = {
        ...updatedMetaData[curMetaDataIndex],
        offsetx: x,
        offsety: y,
      };
      setMetaData(updatedMetaData);
    }
  }

  function handleDeleteMetaDataById(id: string) {
    const modifiedArr = metaData.filter((v) => v.metadata_id !== id);
    setMetaData(modifiedArr);
  }

  return (
    <>
      {metaData.length > 0 &&
        metaData.map(
          (v, i) =>
            v.parent_id === null && (
              <div
                key={i}
                id={`metadata_id_${v.metadata_id}`}
                style={{
                  top: `${v.offsety}%`,
                  left: `${v.offsetx}%`,
                }}
                className={cn(
                  "absolute group flex rounded-t-3xl rounded-br-3xl  -translate-y-full cursor-default",
                  curSelectedMetaDataId && curSelectedMetaDataId === v.metadata_id
                    ? "bg-transparent z-50"
                    : "bg-white z-10"
                )}
                onClick={(e) => handleClickMetaData(e, v.metadata_id)}
                draggable
                onDragStart={(e) => {
                  // Required to make drag work
                  e.dataTransfer.setData("text/plain", v.metadata_id);
                  e.dataTransfer.effectAllowed = "move";
                  e.currentTarget.style.cursor = "default";
                }}
                onDragEnd={(e) => handleOnDragEnd(e)}
                onDragCapture={(e) => (e.currentTarget.style.cursor = "default")}
                onPointerOver={(e) => (e.currentTarget.style.cursor = "default")}
              >
                {curSelectedMetaDataId && v.metadata_id === curSelectedMetaDataId ? (
                  <CommentListDisplay
                    comments={handleGetAllSubComments()}
                    handleDeleteMetaDataById={handleDeleteMetaDataById}
                  />
                ) : (
                  <div className="p-1 flex">
                    <div className="bg-blue-400  text-white p-1 px-2.5 h-fit capitalize rounded-full group-hover:m-2">
                      {v.created_by[0]}
                    </div>
                    <div
                      className={cn(
                        "hidden group-hover:block bg-white text-black m-2  max-w-[10rem] overflow-hidden",
                        curSelectedMetaDataId ? "z-0" : "z-1"
                      )}
                    >
                      <div className="flex gap-5 justify-between">
                        <span className="text-[0.8rem] font-semibold">{v.created_by}</span>
                        <span className="text-[0.8rem] text-gray-400">{format(v.created_at, "dd MMMM yyyy")}</span>
                      </div>
                      <span className="text-[0.8rem]">{v.metadata_value}</span>
                    </div>
                  </div>
                )}
              </div>
            )
        )}
    </>
  );
};

export default MetaDataAnnotationLayer;
