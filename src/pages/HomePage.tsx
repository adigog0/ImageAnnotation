import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import ImageUpload from "../components/imageUpload/ImageUpload";
import Modal from "../components/modal/Modal";
import SideNavBar from "../components/sideNavBar/SideNavBar";
import ImageGallery, { type ImagesData } from "./ImageGallery";
import { getAllImages, uploadImage } from "../apis/image";
import CloseIcon from "../assets/icons/close.svg?react";

const HomePage = () => {
  //state
  const [openModal, setOpenModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [allImages, setAllImages] = useState<ImagesData[]>([]);

  //methods
  function handleClickAddNewImage() {
    setOpenModal(true);
    setUploadedFile(null);
  }

  function handleCloseAddNewImageModal() {
    setOpenModal(false);
  }

  async function handleSave() {
    if (uploadedFile === null) return;
    const formData = new FormData();
    formData.append("file", uploadedFile);
    await uploadImage(formData);
    setOpenModal(false);
  }

  async function fetchAllImages() {
    const data = await getAllImages();
    console.log(data.data);
    setAllImages(data.data);
  }

  useEffect(() => {
    fetchAllImages();
  }, [openModal]);

  return (
    <div className="h-dvh flex p-10">
      <SideNavBar />
      <div className="w-full flex flex-col">
        <Header handleAddNewImage={handleClickAddNewImage} />
        <ImageGallery imagesData={allImages} />
      </div>
      <Modal openState={openModal} handleCloseModal={handleCloseAddNewImageModal} className="min-h-44">
        <div className=" flex flex-col gap-5">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Add New Image</span>
            <button onClick={handleCloseAddNewImageModal} className="ml-auto cursor-pointer rounded-full bg-black p-1">
              <CloseIcon className="rounded-full" />
            </button>
          </div>
          <ImageUpload setUploadedFile={setUploadedFile} uploadedFile={uploadedFile} />
          <div className="flex ml-auto gap-3">
            <button
              onClick={handleCloseAddNewImageModal}
              className="bg-gray-200 py-2 px-4 w-fit cursor-pointer rounded-lg text-gray-600 inline-block border border-transparent hover:border-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-gray-200 py-2 px-4 w-fit cursor-pointer rounded-lg text-gray-600 inline-block border border-transparent hover:border-gray-400"
              disabled={!uploadedFile}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
