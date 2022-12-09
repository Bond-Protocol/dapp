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
    <div className={`mx-3 flex justify-between uppercase ${props.className}`}>
      <ArrowLeft
        onClick={props.onClickLeft || goBack}
        className="my-auto hover:cursor-pointer"
      />
      {props.children}

      {props.rightText && !props.link && (
        <div
          className="flex font-mono text-sm uppercase text-light-secondary hover:cursor-pointer hover:underline"
          onClick={props.onClickRight}
        >
          <p className="my-auto mr-1">{props.rightText}</p>
          <ArrowLeft className="my-auto rotate-180" />
        </div>
      )}
      {props.link && (
        <Link
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          className="my-auto font-fraktion font-bold tracking-wide text-light-secondary hover:opacity-80"
          iconClassName="mt-1 ml-1"
        >
          {props.rightText}
        </Link>
      )}
    </div>
  );
};
