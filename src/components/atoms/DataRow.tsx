import {FC, ReactNode} from "react";

type DataRowProps = {
  leftContent: string;
  rightContent: any;
  onClick?: () => void;
};

export const DataRow: FC<DataRowProps> = ({
  leftContent,
  rightContent,
  onClick,
}) => {
  return (
    <div
      className={`flex justify-between ${
        onClick ? "hover:cursor-pointer" : ""
      }`}
    >
      <div>{leftContent}</div>
      <div onClick={onClick && (() => onClick())}>{rightContent}</div>
    </div>
  );
};
