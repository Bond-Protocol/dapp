import {FC, useState} from "react";

export const ExpandableRow: FC<{
  children: React.ReactNode;
  expanded: React.ReactNode;
  className: string;
}> = ({ children, expanded, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        className={"hover:cursor-pointer justify-between " + className}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
      </tr>

      {open && expanded}
    </>
  );
};
