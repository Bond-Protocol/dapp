import { FC } from "react";

export const Table: FC<{ children: React.ReactNode }> = (props) => {
  return (
    <table className="w-full table-fixed text-left">{props.children}</table>
  );
};
