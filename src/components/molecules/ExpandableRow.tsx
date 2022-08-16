import { FC, useEffect, useState } from "react";

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
  }, [open]);

  return (
    <>
      <tr
        className={"hover:cursor-pointer justify-between" + className}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
      </tr>

      {open && expanded}
    </>
  );
};
