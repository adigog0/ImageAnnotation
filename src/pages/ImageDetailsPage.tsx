import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageById } from "../apis/image";
import type { ImagesData } from "./ImageGallery";
import CommentIcon from "../assets/icons/commentIcon.svg?react";
import Annotation from "../components/annotation/Annotation";
import { cn } from "../lib/tailwind";
import TagOptions from "../assets/icons/tagOptions.svg?react";

export const ImageDetailsPage = () => {
  //state
  const [imageData, setImageData] = useState<ImagesData | null>(null);
  const [commentEnabled, setCommentEnabled] = useState(false);
  const [metaData, setMetaData] = useState(null);
  const [offsetValue, setOffsetValue] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //hooks
  const { imageId } = useParams();
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  //methods

  function handleEnableComment() {
    setCommentEnabled((prev) => !prev);
  }

  function handleAddAnnotation(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    console.log(e.clientX, e.clientY);
    setOffsetValue({
      x: e.clientX,
      y: e.clientY,
    });
  }

  async function fetchImageById() {
    if (!imageId) return;
    const imageData = await getImageById(imageId);
    console.log("imageDta from api", imageData);
    setImageData(imageData.data[0]);
  }

  useEffect(() => {
    fetchImageById();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      console.log("clicked outside");
      if (imageContainerRef.current && !imageContainerRef.current.contains(e.target as HTMLDivElement)) {
        setCommentEnabled(false);
      }
    };

    if (commentEnabled) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageContainerRef.current]);

  console.log(commentEnabled, imageContainerRef);

  return (
    <div className="p-9 flex flex-col justify-center  h-full items-center gap-3">
      <div className=" flex gap-2">
        <button
          id="comment"
          className={cn(
            "bg-white border border-gray-400  p-2 rounded-xl hover:bg-amber-100",
            commentEnabled ? "bg-amber-100" : "bg-white"
          )}
          onClick={handleEnableComment}
        >
          <CommentIcon fill="grey" className="cursor-pointer" />
        </button>

        <button id="tag" className="bg-white border border-gray-400 p-2 rounded-xl hover:bg-amber-100">
          <TagOptions fill="grey" className="cursor-pointer" />
        </button>
      </div>

      <div className="w-[70rem]  flex justify-center" ref={imageContainerRef}>
        <img
          src={imageData?.image_url}
          id="viewed_image"
          className={cn("relative", commentEnabled ? "cursor-[url('/icons/addCommentIcon.svg'),_auto]" : "cursor-auto")}
          onClick={(e) => handleAddAnnotation(e)}
        />
      </div>

      {commentEnabled && offsetValue && <Annotation offsetValues={offsetValue} />}
    </div>
  );
};
export default ImageDetailsPage;
