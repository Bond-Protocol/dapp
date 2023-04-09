import { Link, TokenLogo } from "components/atoms";

export const SummaryLabel = (props: {
  icon?: string;
  value: string;
  subtext: string;
  className?: string;
  href?: string;
  small?: boolean;
}) => {
  return (
    <div
      className={`font-fraktion bg-white/5 p-4 pt-3 ${
        props.small ? "text-center" : ""
      } ${props.className}`}
    >
      <div
        className={`flex items-center ${props.small ? "justify-center" : ""}`}
      >
        {props.icon && (
          <TokenLogo className="-ml-1 mr-2 w-[24px]" icon={props.icon} />
        )}
        <p className={props.small ? "" : "text-2xl"}>{props.value}</p>
      </div>
      {props.href ? (
        <Link href={props.href} className="text-light-grey fill-light-grey">
          {props.subtext}
        </Link>
      ) : (
        <p className="text-light-grey text-base leading-none">
          {props.subtext}
        </p>
      )}
    </div>
  );
};
