import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getImageById,
  getImagePath,
  getMetaDataByImageId,
  saveAllMetaDataByImageId,
  updateImagePathByImageId,
} from "../apis/image";
import type { ImagesData } from "./ImageGallery";
import MetaDataAnnotationLayer from "../components/metaDataAnnotationsLayer/MetaDataAnnotationLayer";
import AddAnnotation from "../components/annotation/AddAnnotation";
import { v4 as uuid } from "uuid";
import type { ActionTypes } from "../components/actionToolBar/ActionToolbar";
import ActionToolbar from "../components/actionToolBar/ActionToolbar";
import { calculateDistance } from "../utils/calculateDistance";
import SketchCanvas from "../components/sketchCanvas/SketchCanvas";
import { cn } from "../lib/tailwind";
import { useResponsiveCanvasSize } from "../hooks/useResponsiveCanvasSize";
import { type CanvasPath } from "react-sketch-canvas";
import { toast } from "react-toastify";
import { denormalizePaths, normalizePaths } from "../utils/constants";
import CommentSideBar from "../components/commentComponents/CommentSideBar";
import PathOverlay from "../components/pathOverlay/PathOverlay";
import BottomCommentMenu from "../components/bottomContentMenu/BottomContentMenu";
import type { MetaData } from "../types/constant";
import Annotator from "./Annotator";

type metaDataCtx = {
  metaData: MetaData[];
  setMetaData: React.Dispatch<React.SetStateAction<MetaData[]>>;
  curSelectedMetaDataId: string | null;
  handleAddComment: (val: string, type: "new" | "sub") => void;
  selectedAction: ActionTypes | null;
  setSelectedAction: React.Dispatch<React.SetStateAction<ActionTypes | null>>;
  handleHideAllMetadata: () => void;
  handleDeSelectMetadata: () => void;
  showAllMetadata: () => void;
};

const imageMetaDataCtx = createContext<null | metaDataCtx>(null);

export function useMetaDataCtx() {
  const ctx = useContext(imageMetaDataCtx);
  if (ctx === null) throw new Error("MetaData info ctx cannot be used outside its provider");
  return ctx;
}

const MAX_WIDTH = 1120;
const MAX_HEIGHT = 720;

export const ImageDetailsPage = () => {
  //state
  const [imageData, setImageData] = useState<ImagesData | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionTypes | null>(null);
  const [metaData, setMetaData] = useState<MetaData[]>([]);
  const [offsetValue, setOffsetValue] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);
  const [curSelectedMetaDataId, setCurSelectedMetaDataId] = useState<string | null>(null);
  const [canvasPaths, setCanvasPaths] = useState<CanvasPath[]>([]);
  const [openBottomMenu, setOpenBottomMenu] = useState(false);

  //hooks
  const { imageId } = useParams();
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const sideBarRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useResponsiveCanvasSize(imageData?.image_url ?? "", MAX_WIDTH, MAX_HEIGHT);

  //const
  const safeZoneRefs = [sideBarRef];
  const subComments = useMemo(() => {
    if (!curSelectedMetaDataId) return [];
    return metaData.filter((v) => v.metadata_id === curSelectedMetaDataId || v.parent_id === curSelectedMetaDataId);
  }, [curSelectedMetaDataId, metaData]);

  //methods

  function handleEnableComment() {
    setOffsetValue(null);
    showAllMetadata();
  }

  function handleAddAnnotation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setCurSelectedMetaDataId(null);
    if (selectedAction !== "Add comment") return;
    handleOpenBottomMenu();
    setOffsetValue(null);
    e.stopPropagation();
    const imageElem = document.getElementById("current_image");
    if (imageElem) {
      const rect = imageElem.getBoundingClientRect();
      const x = ((e.clientX - Math.round(rect.left)) / rect.width) * 100;
      const y = ((e.clientY - Math.round(rect.top)) / rect.height) * 100;
      setOffsetValue({
        x,
        y,
        value: "",
      });
    }
  }

  function handleAddMetadata(val: string) {
    console.log("add metadata called", val);
    if (val.trim() === "") return;
    setOffsetValue((prev) => ({
      ...prev!,
      value: val,
    }));
    handleAddComment(val, "new");
  }

  function handleClickMetaData(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) {
    e.stopPropagation();
    handleOpenBottomMenu();
    setSelectedAction(null);
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

  function handleGetNearestElems(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (selectedAction !== "Nearest tags") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - Math.round(rect.left)) / rect.width) * 100;
    const mouseY = ((e.clientY - Math.round(rect.top)) / rect.height) * 100;

    const THRESHOLD = 20;

    metaData.forEach((v) => {
      const minDist = calculateDistance(mouseX, mouseY, v.offsetx, v.offsety);
      const tagEl = document.getElementById(`metadata_id_${v.metadata_id}`);
      if (!tagEl) return;
      tagEl.style.visibility = minDist <= THRESHOLD ? "visible" : "hidden";
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
    setSelectedAction((prev) => {
      const isSameAction = prev === actionType;
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
          isSameAction ? showAllMetadata() : handleNearestTag();
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
    setSelectedAction(null);
    showAllMetadata();
  }

  function handleUpdateImagePath(path: CanvasPath[]) {
    setCanvasPaths(path);
  }

  function handleDeSelectMetadata() {
    setCurSelectedMetaDataId(null);
  }

  function handleCloseBottomMenu() {
    setOpenBottomMenu(false);
    setOffsetValue(null);
  }

  function handleOpenBottomMenu() {
    setOpenBottomMenu(true);
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
      if (tmpObj) {
        setMetaData((prev) => [...prev, tmpObj]);
        setOffsetValue(null);
      }
    },
    [offsetValue, curSelectedMetaDataId]
  );

  async function handleSaveMetaData() {
    const res = await saveAllMetaDataByImageId(imageId ?? "", metaData);
    if (res.status === 200) {
      const normalisedPaths = normalizePaths(canvasPaths, width, height);
      await updateImagePathByImageId(imageId ?? "", JSON.stringify(normalisedPaths));
      toast.success("Metadata succesfully saved!");
    } else {
      toast.error("Error in saving metadata!");
    }
  }

  async function fetchImageById() {
    if (!imageId) return;
    const res = await getImageById(imageId);
    setImageData(res.data[0]);
  }

  async function fetchMetaDataByImageId() {
    const res = await getMetaDataByImageId(imageId ?? "");
    if (res.data.length > 0) {
      setMetaData(res.data);
      const pathRes = await getImagePath(imageId ?? "");
      if (pathRes.data.length > 0) {
        const denormalisedPaths = denormalizePaths(JSON.parse(pathRes.data[0].image_paths), width, height);
        setCanvasPaths(denormalisedPaths);
      }
    }
  }

  //lifecycle
  useEffect(() => {
    fetchImageById();
  }, [imageId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!selectedAction) return;
      const clickedInSafeZone = safeZoneRefs.some((ref) => ref.current?.contains(e.target as Node));
      const clickedInImageContainer = imageContainerRef.current?.contains(e.target as Node);
      const clickedInActionContainer = actionRef.current?.contains(e.target as Node);
      if (!clickedInImageContainer && !clickedInSafeZone && !clickedInActionContainer) {
        setOffsetValue(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (imageData && width > 0 && height > 0) {
      fetchMetaDataByImageId();
    }
  }, [imageData, width, height]);

  return (
    // <imageMetaDataCtx.Provider
    //   value={{
    //     curSelectedMetaDataId,
    //     metaData,
    //     setMetaData,
    //     handleAddComment,
    //     selectedAction,
    //     setSelectedAction,
    //     handleHideAllMetadata,
    //     showAllMetadata,
    //     handleDeSelectMetadata,
    //   }}
    // >
    //   <div className="h-screen flex flex-row relative">
    //     {/** Side bar - to show all comments : Desktop view */}
    //     {(selectedAction === "All comments" || curSelectedMetaDataId) && (
    //       <CommentSideBar
    //         getTotalSubCommentCount={getTotalSubCommentCount}
    //         onClickMetaData={handleClickMetaData}
    //         ref={sideBarRef}
    //       />
    //     )}

    //     {/** Image Container */}
    //     <div className="flex flex-1 flex-col justify-center items-center gap-3">
    //       <div
    //         style={{
    //           width: width,
    //           height: height,
    //           cursor: selectedAction === "Add comment" ? "url('/icons/addCommentIcon.svg') 1 30, auto" : "auto",
    //         }}
    //         className={cn("relative flex justify-center items-center")}
    //         ref={imageContainerRef}
    //         onDragOver={(e) => e.preventDefault()}
    //         onClick={(e) => handleAddAnnotation(e)}
    //         onMouseMove={(e) => handleGetNearestElems(e)}
    //       >

    //         {/** sketch Canvas - for Drawing on image */}
    //         {imageData && (
    //           <SketchCanvas
    //             image_url={imageData?.image_url}
    //             handleSetMainAction={handleSetMainAction}
    //             handleUpdatePath={handleUpdateImagePath}
    //             canvasPath={canvasPaths}
    //             inDrawMode={selectedAction === "Draw"}
    //           />
    //         )}

    //         {/** Path Overlay - to show the paths drawn on image*/}
    //         {selectedAction !== "Draw" && (
    //           <PathOverlay
    //             hideAllPaths={selectedAction === "Hide Paths" ? true : false}
    //             paths={canvasPaths}
    //             canvasWidth={width}
    //             canvasHeight={height}
    //             denormalize={({ x, y }) => ({
    //               x: x,
    //               y: y,
    //             })}
    //           />
    //         )}

    //         {/** Metadata layer - to map all the comments on image */}
    //         {imageData && metaData.length > 0 && <MetaDataAnnotationLayer handleClickMetaData={handleClickMetaData} />}

    //         {/** To add new Annotation - new comment on image */}
    //         {selectedAction === "Add comment" && offsetValue && (
    //           <AddAnnotation offsetValues={offsetValue} handleAddMetadata={handleAddMetadata} />
    //         )}
    //       </div>
    //     </div>

    //     {/** Action toolBar */}
    //     {selectedAction !== "Draw" && (
    //       <div ref={actionRef} className="absolute bottom-0 left-1/2 -translate-2/4">
    //         <ActionToolbar handleSelectedAction={handleSelectedAction} />
    //       </div>
    //     )}

    //     {/** Bottom Menu - Mobile View only */}
    //     {openBottomMenu && (
    //       <div className="block md:hidden w-full absolute bottom-0">
    //         <BottomCommentMenu
    //           isOpen={openBottomMenu}
    //           handleCloseMenu={handleCloseBottomMenu}
    //           handleAddMetadata={handleAddMetadata}
    //           subComments={subComments}
    //         />
    //       </div>
    //     )}
    //   </div>
    // </imageMetaDataCtx.Provider>

    // <div className="h-dvh flex">
    //   <div className="w-[30rem] bg-white h-full hidden md:block">sidebar</div>
    //   <div className=" flex-1 border">
        <Annotator
          image_alt="image"
          image_url={imageData?.image_url ?? ""}
          // maxHeight={MAX_HEIGHT}
          // maxWidth={MAX_WIDTH}
          onDelete={(val) => console.log("delete triggered", val)}
          onEdit={(val) => console.log("edit", val)}
          currentUserId="Unknown"
          drawingOptions={{
            strokeColor: "#0000FF",
            strokeWidth: 10,
          }}
          enableDrawing
        />
    //   </div>
    // </div>
  );
};
export default ImageDetailsPage;
