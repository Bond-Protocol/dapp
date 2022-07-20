import { FC, useState } from "react";

export const ExpandableRow: FC<{
  children: React.ReactNode;
  expanded: React.ReactNode;
}> = ({ children, expanded }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        className="hover:cursor-pointer justify-between"
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
      </tr>

      {open && expanded}
    </>
  );
};
