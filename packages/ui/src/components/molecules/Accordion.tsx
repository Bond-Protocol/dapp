import { FC, useEffect, useState } from "react";
import ArrowIcon from "../../assets/icons/arrow-icon.svg?react";

export const Accordion: FC<{
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  iconClassname?: string;
  onOpen?: () => any;
  onClose?: () => any;
}> = ({ children, label, className, onOpen, onClose, iconClassname }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && onOpen && onOpen();
    !open && onClose && onClose();
  }, [open, onClose, onOpen]);

  return (
    <>
      <div
        className={
          "z-20 flex overflow-hidden px-3 py-11 hover:cursor-pointer " +
          className
        }
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-full select-none font-bold hover:cursor-pointer">
          {label}
        </div>
        <ArrowIcon
          className={`${
            open ? "" : "-rotate-180"
          } my-auto transition-all hover:cursor-pointer ${iconClassname}`}
        />
      </div>

      <div
        className={`${
          open ? "opacity-100" : "hidden h-0 opacity-0"
        } overflow-x-disable max-h-96 overflow-auto transition-all duration-200`}
      >
        {children}
      </div>
    </>
  );
};
