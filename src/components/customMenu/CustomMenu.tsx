import { useEffect, useRef, useState } from "react";

type CustomMenuProps = {
  buttonRef: HTMLElement | null;
  handleClose: () => void;
  children: React.ReactNode;
};

const CustomMenu = ({ buttonRef, handleClose, children }: CustomMenuProps) => {
  //state
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  //hook
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (buttonRef) {
      const parent = buttonRef?.offsetParent as HTMLElement; // The closest relative-positioned ancestor
      const rect = buttonRef.getBoundingClientRect();
      const parentRect = parent?.getBoundingClientRect();

      setPosition({
        top: rect.bottom - parentRect?.top + 4, // relative to parent top
        left: rect.left - parentRect?.left, // relative to parent left
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef &&
        !buttonRef.contains(e.target as Node) &&
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [buttonRef, handleClose]);

  if (!buttonRef || !position) return null;

  return (
    <div
      ref={menuContainerRef}
      className="absolute z-50 bg-white rounded-md py-2 max-w-[20rem] shadow-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        // position: "absolute",
      }}
    >
      {children}
    </div>
  );
};

export default CustomMenu;
