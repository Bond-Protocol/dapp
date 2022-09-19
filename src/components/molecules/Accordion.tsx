import { FC, useEffect, useState } from "react";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-icon.svg";

export const Accordion: FC<{
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  onOpen?: () => any;
  onClose?: () => any;
}> = ({ children, label, className, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && onOpen && onOpen();
    !open && onClose && onClose();
  }, [open, onClose, onOpen]);

  return (
    <>
      <div
        className={
          "px-3 py-11 flex hover:cursor-pointer z-20 overflow-hidden " +
          className
        }
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-full hover:cursor-pointer font-bold uppercase select-none">
          {label}
        </div>
        <ArrowIcon
          className={`${
            open ? "" : "-rotate-180"
          } fill-black my-auto hover:cursor-pointer transition-all`}
        />
      </div>

      <div
        className={`${
          open ? "opacity-100" : "opacity-0 h-0 hidden"
        } text-black transition-all duration-200 max-h-96 overflow-auto overflow-x-disable`}
      >
        {children}
      </div>
    </>
  );
};
