import { FC } from "react";

export const Table: FC<{ children: React.ReactNode }> = (props) => {
  return (
    <table className="w-full text-left table-fixed">{props.children}</table>
  );
};
