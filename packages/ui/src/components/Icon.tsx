import { HtmlHTMLAttributes } from "react";

export interface IconProps extends HtmlHTMLAttributes<HTMLImageElement> {}

export const Icon = ({ className = "", ...props }: IconProps) => {
  return (
    <div className={className}>
      <img {...props} />
    </div>
  );
};
