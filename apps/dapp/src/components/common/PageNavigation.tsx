import { useMediaQueries } from "hooks/useMediaQueries";
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
  /** hack to support embed routes*/
  skip?: boolean;
}

export const PageNavigation = (props: PageNavigationProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { isTabletOrMobile } = useMediaQueries();

  if (props.skip) {
    return <>{props.children}</>;
  }

  return (
    <div>
      <div
        className={`flex items-center justify-between pr-3 ${props.className}`}
      >
        <div
          className="my-auto cursor-pointer pl-3 pr-1 hover:text-light-secondary"
          onClick={props.onClickLeft || goBack}
        >
          <ArrowLeft />
        </div>

        {!isTabletOrMobile && props.children}

        {props.rightText && !props.link && (
          <div
            className="flex font-mono text-base font-bold uppercase text-light-secondary hover:cursor-pointer"
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
            className="my-auto whitespace-nowrap font-mono text-base font-bold uppercase text-light-secondary hover:cursor-pointer"
            iconClassName="mt-0.5 ml-1 my-auto"
          >
            {props.rightText}
          </Link>
        )}
      </div>

      {isTabletOrMobile && <div className="mx-4 my-2">{props.children}</div>}
    </div>
  );
};
