import { useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import SideNavBar from "./components/sideNavBar/SideNavBar";
import ImageGallery from "./pages/ImageGallery";
import Modal from "./components/modal/Modal";

function App() {
  //state
  const [openModal, setOpenModal] = useState(false);
  //methods
  function handleClickAddNewImage() {
    setOpenModal(true);
  }

  function handleCloseAddNewImageModal() {
    setOpenModal(false);
  }
  return (
    <div className="h-dvh flex p-10">
      <SideNavBar />
      <div className="w-full flex flex-col">
        <Header handleAddNewImage={handleClickAddNewImage} />
        <ImageGallery galleryData={[]} />
      </div>
      <Modal openState={openModal} handleCloseModal={handleCloseAddNewImageModal} className="min-h-44">
        <div className="border border-black">
          <div className="flex justify-between">
          <span className="text-xl text-black" >Add New Image</span>
          <button
            onClick={handleCloseAddNewImageModal}
            className="ml-auto cursor-pointer"
          >
            &times;
          </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
