import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageById, getMetaDataByImageId, saveAllMetaDataByImageId } from "../apis/image";
import type { ImagesData } from "./ImageGallery";
import MetaDataAnnotationLayer from "../components/metaDataAnnotationsLayer/MetaDataAnnotationLayer";
import AddAnnotation from "../components/annotation/AddAnnotation";
import { v4 as uuid } from "uuid";
import SideBar from "../components/SideBar/SideBar";
import CommentCard from "../components/commentCard/CommentCard";
import type { ActionTypes } from "../components/actionToolBar/ActionToolbar";
import ActionToolbar from "../components/actionToolBar/ActionToolbar";
import { calculateDistance } from "../utils/calculateDistance";
import SketchCanvas from "../components/sketchCanvas/SketchCanvas";
import { cn } from "../lib/tailwind";

type metaDataCtx = {
  metaData: MetaData[];
  setMetaData: React.Dispatch<React.SetStateAction<MetaData[]>>;
  curSelectedMetaDataId: string | null;
  handleAddComment: (val: string, type: "new" | "sub") => void;
};
const imageMetaDataCtx = createContext<null | metaDataCtx>(null);

export function useMetaDataCtx() {
  const ctx = useContext(imageMetaDataCtx);
  if (ctx === null) throw new Error("MetaData info ctx cannot be used outside its provider");
  return ctx;
}

export type MetaData = {
  metadata_id: string;
  parent_id: string | null;
  metadata_value: string;
  offsetx: number;
  offsety: number;
  created_at: Date | string;
  created_by: string;
  updated_at?: Date | string;
};

export const ImageDetailsPage = () => {
  //state
  const [imageData, setImageData] = useState<ImagesData | null>(null);
  const [selectedActions, setSelectedActions] = useState<ActionTypes | null>(null);
  const [metaData, setMetaData] = useState<MetaData[]>([]);
  const [offsetValue, setOffsetValue] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);
  const [curSelectedMetaDataId, setCurSelectedMetaDataId] = useState<string | null>(null);

  //hooks
  const { imageId } = useParams();
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const sideBarRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);

  //const
  const safeZoneRefs = [sideBarRef];

  //methods

  function handleEnableComment() {
    setOffsetValue(null);
  }

  function handleAddAnnotation(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    if (selectedActions !== "Add comment") return;
    setOffsetValue(null);
    e.stopPropagation();
    const imageElem = document.getElementById("current_image");
    if (imageElem) {
      const rect = imageElem.getBoundingClientRect();
      const x = ((e.clientX - Math.round(rect.left)) / rect.width) * 100;
      const y = ((e.clientY - Math.round(rect.top)) / rect.height) * 100;
      // const x = e.clientX - Math.round(rect.left);
      // const y = e.clientY - Math.round(rect.top);
      setOffsetValue({
        x,
        y,
        value: "",
      });
      setCurSelectedMetaDataId(null);
    }
  }

  function handleAddMetadata(val: string) {
    if (val.trim() === "") return;
    setOffsetValue((prev) => ({
      ...prev!,
      value: val,
    }));
    handleAddComment(val, "new");
  }

  function handleClickMetaData(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) {
    console.log("clicked metadata");
    e.stopPropagation();
    setSelectedActions(null);
    setOffsetValue(null);
    setCurSelectedMetaDataId(id);

    const selectedObj = metaData.find((v) => v.metadata_id === id);

    if (selectedObj) {
      setOffsetValue({
        x: selectedObj.offsetx,
        y: selectedObj.offsety,
        value: selectedObj.metadata_value,
      });
    }
  }

  function getTotalSubCommentCount(parentId: string) {
    const subCommentArr = metaData.filter((c) => c.parent_id === parentId);
    if (subCommentArr) return subCommentArr.length;
    else return 0;
  }

  function handleDeleteMetaDataById(id: string) {
    const modifiedArr = metaData.filter((v) => v.metadata_id !== id);
    setMetaData(modifiedArr);
  }

  function handleEditMetaData() {}

  function handleDraw() {
    handleHideAllMetadata();
  }

  function handleGetNearestElems(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    if (selectedActions !== "Nearest tags") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - Math.round(rect.left)) / rect.width) * 100;
    const mouseY = ((e.clientY - Math.round(rect.top)) / rect.height) * 100;

    // threshold (e.g., only show if within 20px)
    const THRESHOLD = 20;

    metaData.forEach((v) => {
      let minDist = calculateDistance(mouseX, mouseY, v.offsetx, v.offsety);
      const tagEl = document.getElementById(`metadata_id_${v.metadata_id}`);
      if (!tagEl) return;
      if (minDist <= THRESHOLD) {
        tagEl.style.visibility = "visible";
      } else {
        tagEl.style.visibility = "hidden";
      }
    });
  }

  function handleNearestTag() {
    handleHideAllMetadata();
  }

  function handleHideAllMetadata() {
    const elements = document.querySelectorAll('[id^="metadata_id_"]');
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.visibility = "hidden";
      }
    });
  }

  function showAllMetadata() {
    const elements = document.querySelectorAll('[id^="metadata_id_"]');
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.visibility = "visible";
      }
    });
  }

  function handleSelectedAction(actionType: ActionTypes) {
    setSelectedActions((prev) => {
      const isSameAction = prev === actionType;
      showAllMetadata();
      switch (actionType) {
        case "Add comment":
          handleEnableComment();
          break;
        case "Draw":
          handleDraw();
          break;
        case "Hide comments":
          isSameAction ? showAllMetadata() : handleHideAllMetadata();
          break;
        case "Nearest tags":
          handleNearestTag();
          break;
        case "Save comments":
          handleSaveMetaData();
          break;
        default:
          break;
      }

      return isSameAction ? null : actionType;
    });
  }

  function handleSetMainAction() {
    setSelectedActions(null);
  }

  const handleAddComment = useCallback(
    (val: string, type: "new" | "sub") => {
      console.log("handle add sun comment data", val, type, offsetValue);
      // check if cur selectedMetaData's parentId is null if yes then it's a parent
      //add the its id as parent id of the current added metadata

      if (val.trim() === "") return;

      let tmpObj: MetaData | null = null;

      if (type === "new" && offsetValue !== null) {
        tmpObj = {
          metadata_id: uuid(),
          parent_id: null,
          metadata_value: val,
          offsetx: offsetValue.x,
          offsety: offsetValue.y,
          created_at: new Date(),
          created_by: "Unknown",
        };
      } else {
        const curParentObj = metaData.find((v) => v.metadata_id === curSelectedMetaDataId);
        if (!curParentObj) return;
        tmpObj = {
          metadata_id: uuid(),
          parent_id: curSelectedMetaDataId,
          metadata_value: val,
          offsetx: curParentObj.offsetx,
          offsety: curParentObj.offsety,
          created_at: new Date(),
          created_by: "Unknown2",
        };
      }
      console.log("adding metadata", tmpObj);
      if (tmpObj) {
        setMetaData((prev) => [...prev, tmpObj]);
        setOffsetValue(null);
      }
    },
    [offsetValue, curSelectedMetaDataId]
  );

  async function handleSaveMetaData() {
    await saveAllMetaDataByImageId(imageId ?? "", metaData);
  }

  async function fetchImageById() {
    if (!imageId) return;
    const imageData = await getImageById(imageId);
    setImageData(imageData.data[0]);
    fetchMetaDataByImageId();
  }

  async function fetchMetaDataByImageId() {
    const res = await getMetaDataByImageId(imageId ?? "");
    console.log(res.data);
    if (res.data) {
      setMetaData(res.data);
    }
  }

  //lifecycle
  useEffect(() => {
    fetchImageById();
  }, [imageId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedInSafeZone = safeZoneRefs.some((ref) => ref.current?.contains(e.target as HTMLDivElement));
      const clickedInImageContainer = imageContainerRef.current?.contains(e.target as HTMLDivElement);
      const clickedInActionContainer = actionRef.current?.contains(e.target as HTMLDivElement);

      if (!clickedInImageContainer && !clickedInSafeZone && !clickedInActionContainer) {
        console.log("Clicked outside all safe zones");
        // setSelectedActions(null);
        setOffsetValue(null);
      }
    };

    if (selectedActions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedActions]);

  return (
    <imageMetaDataCtx.Provider value={{ curSelectedMetaDataId, metaData, setMetaData, handleAddComment }}>
      <div className="h-screen flex flex-row relative">
        {(selectedActions === "Add comment" || curSelectedMetaDataId) && (
          <SideBar width="20rem" className="hidden md:block absolute">
            <div className="h-full shadow-md" ref={sideBarRef}>
              <div className="p-3 border-b border-gray-300 text-sm font-semibold">Comments</div>
              <div className="p-3 gap-5 flex flex-col">
                <input
                  placeholder="Search"
                  className="w-full h-full outline-none border border-gray-300 py-1 px-2 rounded-lg"
                />

                {metaData.map(
                  (c) =>
                    c.parent_id === null && (
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
                    )
                )}
              </div>
            </div>
          </SideBar>
        )}
        <div className="flex-1 md:flex flex-col justify-center items-center gap-3">
          <div
            className="relative w-[70rem] h-9/12 flex justify-center"
            ref={imageContainerRef}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            {imageData && selectedActions === "Draw" ? (
              <SketchCanvas image={imageData?.image_url} handleSetMainAction={handleSetMainAction} />
            ) : (
              <img
                className="relative"
                src={imageData?.image_url}
                id="current_image"
                style={{
                  cursor: selectedActions === "Add comment" ? "url('/icons/addCommentIcon.svg') 1 30, auto" : "auto",
                }}
                onClick={(e) => handleAddAnnotation(e)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onMouseMove={(e) => handleGetNearestElems(e)}
              />
            )}
            {selectedActions !== "Draw" && (
              <div ref={actionRef} className="absolute -top-12">
                <ActionToolbar selectedActions={selectedActions} handleSelectedAction={handleSelectedAction} />
              </div>
            )}

            {imageData && metaData.length > 0 && <MetaDataAnnotationLayer handleClickMetaData={handleClickMetaData} />}

            {selectedActions === "Add comment" && offsetValue && (
              <AddAnnotation offsetValues={offsetValue} handleAddMetadata={handleAddMetadata} />
            )}
          </div>
        </div>
      </div>
    </imageMetaDataCtx.Provider>
  );
};
export default ImageDetailsPage;
