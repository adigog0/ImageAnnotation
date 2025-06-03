const SearchBar = () => {
  return (
    <div className=" ml-auto mr-auto w-10 lg:w-[50rem] py-3 px-5 rounded-2xl flex justify-center items-center bg-[#F4F4F4]">
      <input placeholder="Search" className="w-full h-full outline-none" />
      {/* <div className="bg-black h-7 w-7 rounded-full"></div> */}
    </div>
  );
};

export default SearchBar;
