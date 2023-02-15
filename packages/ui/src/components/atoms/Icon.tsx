export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Icon = ({
  className = "",
  imageClassName = "",
  onClick,
  ...props
}: IconProps & { imageClassName?: string }) => {
  return (
    <div
      onClick={onClick}
      className={` flex w-[32px] items-center justify-center fill-current text-current transition-colors ${className}`}
    >
      {props.children ? (
        props.children
      ) : (
        <img
          {...props}
          className={`fill-current text-current ${imageClassName}`}
        />
      )}
    </div>
  );
};
