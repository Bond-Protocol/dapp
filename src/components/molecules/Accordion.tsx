import { FC, useEffect, useState } from "react";
import arrowIcon from "../../assets/icons/arrow-icon.svg";

export const Accordion: FC<{
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  onOpen?: () => any;
  onClose?: () => any;
}> = ({ children, content, className, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && onOpen && onOpen();
    !open && onClose && onClose();
  }, [open, onClose, onOpen]);

  return (
    <>
      <div
        className={"px-3 py-7 flex hover:cursor-pointer " + className}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-full hover:cursor-pointer">{children}</div>
        <img
          src={arrowIcon}
          className={`${
            open ? "" : "-rotate-180"
          } hover:cursor-pointer transition-all`}
        />
      </div>

      <div
        className={`${
          open ? "opacity-100 pb-6" : "opacity-0 h-0"
        } transition-all duration-200`}
      >
        {content}
      </div>
    </>
  );
};
