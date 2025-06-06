import type { ReactNode } from "react";
import { cn } from "../../lib/tailwind";

interface IProps {
  children: ReactNode;
  className?: string;
  handleCloseModal: () => void;
  openState: boolean;
}
const Modal = ({ children, className, openState }: IProps) => {
  if (!openState) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      {/** Fullscreen overlays */}
      {/** backdrop for modal */}
      <div className={cn("bg-white p-6 rounded-xl w-full max-w-lg", className)}>
        {/** inner modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
