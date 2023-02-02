import { TextBlock } from "./TextBlock";

type ValuesProps = {
  className?: string;
};

export const Values = (props: ValuesProps) => {
  return (
    <div className={`md:pt-8 ${props.className}`}>
      <div
        title="Bond"
        className="child:px-4 lg:child:w-1/4 grid grid-cols-2 gap-y-4 py-4 backdrop-blur-md lg:flex"
      >
        <TextBlock
          title="Build"
          content={
            <p>
              Custom bond strategies for
              <br />
              protocols - any cycle,
              <br />
              any stage
            </p>
          }
        />
        <TextBlock
          title="Own"
          content={
            <p>
              Liquidity outright
              <br />
              instead of renting from
              <br />
              mercenary capital
            </p>
          }
        />
        <TextBlock
          title="Navigate"
          content={
            <p>
              Treasury management to <br /> provide stability through any <br />{" "}
              market conditions
            </p>
          }
        />
        <TextBlock
          title="Deploy"
          content={
            <p>
              Permissionless bond markets - <br />
              no gatekeepers, no middlemen
            </p>
          }
        />
      </div>
    </div>
  );
};
