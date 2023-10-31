import { Button } from "ui";

export const LimitOrderFallback = (props: any) => {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
        <p className="px-8 text-center font-fraktion text-2xl font-semibold uppercase">
          This market does not support Limit orders
        </p>
        <p>
          Use the <span className="font-bold">Bond</span> tab to bond tokens
        </p>
        <Button onClick={props.onClick}>Bond</Button>
      </div>
    </div>
  );
};
