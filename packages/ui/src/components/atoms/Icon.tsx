export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Icon = ({ className = "", ...props }: IconProps) => {
  return (
    <div className="fill-white text-white">
      <img {...props} className="fill-current text-current" />
    </div>
  );
};
