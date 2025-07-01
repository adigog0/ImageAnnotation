import { cn } from "../../lib/tailwind";

interface IProps {
  orientation?: "Left" | "Right";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
const SideBar = ({ children, orientation = "Left", className, style }: IProps) => {
  return (
    <div
      className={className ? className : cn("bg-white h-full shadow-md")}
      style={{ ...style, width: style?.width ?? "20rem" }}
    >
      {children}
    </div>
  );
};

export default SideBar;
