import { Link, Button } from "..";

export interface ActionCardProps {
  className?: string;
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  url?: string;
  onClickRight?: () => void;
}

export const ActionCard = (props: ActionCardProps) => {
  return (
    <div className={`mx-auto my-10 text-center ${props.className}`}>
      <div className="tracking-wide">{props.title}</div>
      <div className="mt-2 flex justify-center gap-6">
        <Link
          className="font-mono text-sm font-bold uppercase"
          href={props.url}
        >
          {props.leftLabel}
        </Link>
        <Button
          className="text-sm"
          variant="ghost"
          size="sm"
          thin
          onClick={props.onClickRight}
        >
          {props.rightLabel}
        </Button>
      </div>
    </div>
  );
};
