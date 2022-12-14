import { Button } from "ui";

export interface FallbackProps {
  title?: string;
  subtext?: string;
  buttonText?: string;
  onClick?: () => void;
}

export const MarketsFallback = (props: FallbackProps) => {
  return (
    <div className="flex w-full flex-col place-items-center">
      <div className="text-5xl">{props.title}</div>
      <div className="">{props.subtext}</div>
      <Button onClick={props.onClick}>{props.buttonText}</Button>
    </div>
  );
};
