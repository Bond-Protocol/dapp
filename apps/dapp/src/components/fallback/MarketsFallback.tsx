import { Button } from "ui";

export interface FallbackProps {
  title?: string;
  subtext?: string;
}

export const MarketsFallback = (props: FallbackProps) => {
  return (
    <div>
      <div className="text-5xl">{props.title}</div>
      <div className="">{props.subtext}</div>
      <Button>Fff</Button>
    </div>
  );
};
