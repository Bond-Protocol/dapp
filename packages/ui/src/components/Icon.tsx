export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Icon = ({ className = "", ...props }: IconProps) => {
  return (
    <div className={className}>
      <img {...props} />
    </div>
  );
};
