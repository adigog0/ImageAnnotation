import { toast } from "react-toastify";
import ImageIcon from "../../assets/icons/imageIcon.svg?react";

const MIME_TYPE = ["image/jpeg", "image/png", "image/webp", "image/svg"];

interface IProps {
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const ImageUpload = ({ setUploadedFile, uploadedFile }: IProps) => {
  //const
  const loading = false;

  //handlers
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if(MIME_TYPE.includes(file?.type as string)){
      setUploadedFile(file);
    }
    else{
      toast.error("Invalid File Type!")
    }
  }

  return (
    <>
      {uploadedFile ? (
        <div className="p-2">
          <img src={URL.createObjectURL(uploadedFile)} />
        </div>
      ) : (
        <div className=" border-2 border-dotted border-gray-200 p-10">
          <div className="flex flex-col justify-center items-center gap-10">
            {loading ? (
              <div className="p-2">loading..</div>
            ) : (
              <>
                <ImageIcon className="text-gray-500 h-[3rem] w-[3rem]" />
                <span className="text-[#9D9D9D] text-center">Drag and Drop your file here or click to browse</span>
              </>
            )}

            <button>
              <input type="file" id="fileUpload" hidden onChange={handleFileChange} />
              <label
                htmlFor="fileUpload"
                className="bg-gray-200 p-2 w-fit cursor-pointer rounded-lg text-gray-600 inline-block border border-transparent hover:border-gray-400"
              >
                Choose File
              </label>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
