import {useNavigate} from "react-router-dom";
import logo from "../../assets/logo.svg";
import blackLogo from "../../assets/logo-black.svg";

export const ProtocolLogo = (
  props: {
    black?: boolean;
    className?: string;
  } & React.ImgHTMLAttributes<HTMLImageElement>
) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    props.onClick && props.onClick(e);
    navigate("/");
  };

  return (
    <img
      {...props}
      onClick={handleClick}
      src={props.black ? blackLogo : logo}
      className={`hover:cursor-pointer ${props.className}`}
    />
  );
};
