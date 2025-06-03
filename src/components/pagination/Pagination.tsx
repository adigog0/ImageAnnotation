interface IProps {
  pageNo: number;
  pageCount: number;
  handlePageChange: (actionType: "prev" | "next" | number) => void;
}
const Pagination = ({ pageCount, pageNo, handlePageChange }: IProps) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {pageNo}
      <button onClick={() => handlePageChange("prev")}>{"<"}</button>
      {Array(pageCount)
        .fill(0)
        .map((_, i) => (
          <button className="px-2 rounded-xl hover:bg-gray-200" onClick={() => handlePageChange(i + 1)} key={i}>
            {i + 1}
          </button>
        ))}
      <button onClick={() => handlePageChange("next")}>{">"}</button>
    </div>
  );
};

export default Pagination;
