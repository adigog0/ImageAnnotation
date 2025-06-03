import type { JSX } from "react";

interface IProps {
  header: JSX.Element | string;
  content: JSX.Element;
  action?: JSX.Element;
}

const Card = ({ action, content, header }: IProps) => {
  return (
    <div className=" w-[20rem] h-90 p-2 rounded-md bg-[#F4F4F4]">
      {header}
      {content}
      {action && action}
    </div>
  );
};

export default Card;
