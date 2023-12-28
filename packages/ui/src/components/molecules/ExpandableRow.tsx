import { FC, useEffect, useState } from "react";
import { TableCell } from "..";
import ArrowIcon from "../../assets/icons/arrow-icon.svg?react";

export const ExpandableRow: FC<{
  children: React.ReactNode;
  expanded: React.ReactNode;
  className: string;
  onOpen?: () => any;
  onClose?: () => any;
}> = ({ children, expanded, className, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && onOpen && onOpen();
    !open && onClose && onClose();
  }, [open, onClose, onOpen]);

  return (
    <>
      <tr
        className={`
            justify-between transition-all hover:cursor-pointer hover:bg-white/10 
              ${open ? "bg-white/5" : ""}
              ${className} `}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
        <TableCell>
          <ArrowIcon
            className={`${
              open ? "" : "-rotate-180"
            } my-auto transition-all hover:cursor-pointer`}
          />
        </TableCell>
      </tr>

      {open && expanded}
    </>
  );
};
