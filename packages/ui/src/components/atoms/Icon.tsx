export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Icon = ({
  className = "",
  imageClassName = "",
  onClick,
  width,
  ...props
}: IconProps & { imageClassName?: string }) => {
  return (
    <div
      onClick={onClick}
      className={`flex w-fit items-center justify-center fill-current text-current transition-colors ${className}`}
    >
      {props.children ? (
        props.children
      ) : (
        <img
          {...props}
          width={width}
          height={width}
          className={`fill-current text-current ${imageClassName}`}
        />
      )}
    </div>
  );
};
