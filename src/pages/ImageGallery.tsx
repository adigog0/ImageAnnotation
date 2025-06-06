import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/card/Card";

export type ImagesData = {
  created_at: string;
  image_id: number;
  image_name: string;
  image_url: string;
  metadata_id: string | null;
  mime_type: string;
  updated_at: string;
};
interface IProps {
  imagesData: ImagesData[];
}

const ImageGallery = ({ imagesData }: IProps) => {
  //hooks
  const navigate = useNavigate();
  const curlocation = useLocation();

  //methods
  function handleClick(i: number) {
    navigate(`${i}`);
  }

  console.log("curlocation", curlocation);
  return (
    <div className="w-full flex-1 p-9">
      <div className="flex h-full gap-7">
        {imagesData.map((v, i) => (
          <Card
            content={
              <div className="h-full flex items-center">
                <img src={v.image_url} />
              </div>
            }
            header={<div className="p-1 font-semibold text-center">{v.image_name}</div>}
            key={i}
            handleClick={() => handleClick(v.image_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
