import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";

export interface PageNavigationProps {
  children?: React.ReactNode;
  rightText?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export const PageNavigation = (props: PageNavigationProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="flex justify-between">
      <ArrowLeft
        onClick={props.onClickLeft || goBack}
        className="my-auto hover:cursor-pointer"
      />
      {props.children}

      {props.rightText && (
        <div
          className="flex font-mono text-sm uppercase hover:cursor-pointer hover:underline"
          onClick={props.onClickRight}
        >
          <p className="my-auto mr-1">{props.rightText}</p>
          <ArrowLeft className="my-auto rotate-180" />
        </div>
      )}
    </div>
  );
};
