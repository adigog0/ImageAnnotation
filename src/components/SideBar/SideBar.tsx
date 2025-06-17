import { cn } from "../../lib/tailwind";

interface IProps {
  width?: string;
  orientation?: "Left" | "Right";
  children: React.ReactNode;
  className?: string;
}
const SideBar = ({ children, orientation = "Left", width = "20rem", className }: IProps) => {
  return (
    <div
      className={className ? className : cn("bg-white h-full shadow-md")}
      style={{ width: width, height: "100%" }}
    >
      {children}
    </div>
  );
};

export default SideBar;
