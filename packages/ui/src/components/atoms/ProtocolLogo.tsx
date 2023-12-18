import logo from "../../assets/logo.svg";
import blackLogo from "../../assets/logo-black.svg";
import smolLogo from "../../assets/logo-circle.png";

export const ProtocolLogo = ({
  navigate,
  small,
  ...props
}: {
  black?: boolean;
  className?: string;
  navigate?: (to: string) => void;
  small?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    props.onClick && props.onClick(e);
    navigate && navigate("/");
  };

  const longLogo = props.black ? blackLogo : logo;
  const src = small ? smolLogo : longLogo;

  return (
    <img
      {...props}
      onClick={handleClick}
      src={src}
      className={`select-none hover:cursor-pointer ${props.className} ${
        small ? "w-[26px]" : ""
      }`}
    />
  );
};
