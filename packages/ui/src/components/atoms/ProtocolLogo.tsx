import logo from "../../assets/logo.svg";
import blackLogo from "../../assets/logo-black.svg";

export const ProtocolLogo = (
  props: {
    black?: boolean;
    className?: string;
    navigate?: (to: string) => void;
  } & React.ImgHTMLAttributes<HTMLImageElement>
) => {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    props.onClick && props.onClick(e);
    props.navigate && props.navigate("/");
  };

  return (
    <img
      {...props}
      onClick={handleClick}
      src={props.black ? blackLogo : logo}
      className={`select-none hover:cursor-pointer ${props.className}`}
    />
  );
};
