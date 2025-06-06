import type { JSX } from "react";

interface IProps {
  header?: JSX.Element | string;
  content: JSX.Element;
  action?: JSX.Element;
  handleClick?: () => void;
}

const Card = ({ action, content, header, handleClick }: IProps) => {
  return (
    <div
      className=" w-[20rem] h-fit rounded-md bg-[#F4F4F4] cursor-pointer border-2 border-transparent hover:border-gray-300"
      onClick={handleClick}
    >
      <div className="h-80 overflow-auto">{content}</div>
      {header && header}
      {action && action}
    </div>
  );
};

export default Card;
