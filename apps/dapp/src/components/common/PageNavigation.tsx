import { useNavigate } from "react-router-dom";
import { Link } from "ui";
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg";

export interface PageNavigationProps {
  children?: React.ReactNode;
  className?: string;
  rightText?: string;
  link?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export const PageNavigation = (props: PageNavigationProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className={`flex justify-between pr-3 ${props.className}`}>
      <div
        className="my-auto cursor-pointer pl-3 pr-1 hover:text-light-secondary"
        onClick={props.onClickLeft || goBack}
      >
        <ArrowLeft />
      </div>
      {props.children}

      {props.rightText && !props.link && (
        <div
          className="flex font-mono text-sm uppercase text-light-secondary hover:cursor-pointer hover:underline"
          onClick={props.onClickRight}
        >
          <p className="my-auto mr-1 whitespace-nowrap">{props.rightText}</p>
          <ArrowLeft className="my-auto rotate-180" />
        </div>
      )}
      {props.link && (
        <Link
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          className="my-auto font-mono text-sm font-light text-light-secondary hover:cursor-pointer hover:underline"
          iconClassName="mt-0.5 ml-1 my-auto"
        >
          {props.rightText}
        </Link>
      )}
    </div>
  );
};
