import Card from "../components/card/Card";

interface IProps {
  galleryData: [];
}

const ImageGallery = ({}: IProps) => {
  return (
    <div className="w-full flex-1 p-9">
      <div className="flex h-full gap-7">
        {Array(3)
          .fill(0)
          .map((i) => (
            <Card content={<></>} header={<></>} key={i} />
          ))}
      </div>
    </div>
  );
};

export default ImageGallery;
