import { memo } from "react";
import SendIcon from "../../assets/icons/send.svg?react"

interface IProps {
  offsetValues: {
    x: number;
    y: number;
  } | null;
}

const Annotation = ({ offsetValues }: IProps) => {
  if (!offsetValues) return;
  return (
    <div
      className="bg-amber-50 p-3 absolute rounded-xl flex flex-col gap-2"
      style={offsetValues ? { top: `${offsetValues.y}px`, left: `${offsetValues.x}px` } : {}}
    >
      <div className="flex gap-2">
        <div className="bg-fuchsia-900 rounded-full text-white p-1 px-2.5 h-fit">U</div>
        <textarea className="border border-gray-400 rounded-xl p-2 resize-none" rows={3} cols={40}></textarea>
      </div>
      <div className="border border-black flex gap-2">
        <div className="bg-fuchsia-900 rounded-full text-white p-1 px-2.5 h-fit ">U</div>
        <button>

        <input className="border border-gray-400 rounded-xl p-1 resize-none" />
        </button>
        <SendIcon/>
      </div>
    </div>
  );
};

export default memo(Annotation);
