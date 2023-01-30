import { TextBlock } from "./TextBlock";

type ValuesProps = {
  className?: string;
};

export const Values = (props: ValuesProps) => {
  return (
    <div className={`md:pt-8 ${props.className}`}>
      <div
        title="Bond"
        className="backdrop-blur-md grid grid-cols-2 gap-y-4 lg:flex py-4 child:px-4 lg:child:px-8"
      >
        <TextBlock
          title="Bond"
          content="Custom bond strategies for protocols - any cycle, any stage"
        />
        <TextBlock
          title="Own"
          content={
            <p>
              Protocol-Owned Liquidity instead of renting from <br />
              mercenary capital
            </p>
          }
        />
        <TextBlock
          title="Nurture"
          content="Treasury management to provide stability through any market conditions"
        />
        <TextBlock
          title="Deploy"
          content="Permissionless bond markets - no gatekeepers, no middlemen"
        />
      </div>
    </div>
  );
};
