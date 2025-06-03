import SearchBar from "../searchbar/SearchBar";

interface IProps {
  handleAddNewImage: () => void;
}
const Header = ({ handleAddNewImage }: IProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <SearchBar />
        <button
          className=" bg-black text-white rounded-xl px-3 font-semibold hidden lg:block cursor-pointer"
          onClick={handleAddNewImage}
        >
          Add Image
        </button>
        <button
          onClick={handleAddNewImage}
          className=" bg-black text-white rounded-full px-3 font-semibold lg:hidden cursor-pointer"
        >
          +
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
