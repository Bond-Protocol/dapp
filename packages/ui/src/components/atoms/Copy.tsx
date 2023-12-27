import CopyIcon from "../../assets/icons/copy-icon.svg";
import { useState } from "react";

export type CopyProps = {
  content: string;
  className?: string;
  iconClassname?: string;
  iconWidth?: number;
};

export const Copy = ({ iconWidth = 16, ...props }: CopyProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    navigator.clipboard.writeText(props.content);
  };

  return (
    <>
      <div onClick={handleClick} className="my-auto cursor-help">
        <img src={CopyIcon}
          className={`hover:fill-light-secondary my-auto transition-all ${props.iconClassname}`}
          width={iconWidth}
        />
      </div>
    </>
  );
};
