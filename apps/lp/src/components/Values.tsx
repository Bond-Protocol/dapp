import { TextBlock, InfoLabel } from "./common";

type ValuesProps = {
  className?: string;
};

const tbv = "$75M";
const markets = "500";
const bonds = "7.5K";

export const Values = (props: ValuesProps) => {
  return (
    <div className={`${props.className}`}>
      <div className="flex flex-wrap justify-center gap-4 py-4 lg:flex-nowrap">
        <div className="w-full grow lg:w-1/3 lg:grow-0">
          <InfoLabel label="Total Bonded Value">
            {tbv}
            <span className="text-[32px]">+</span>
          </InfoLabel>
        </div>
        <div className="grow lg:w-1/3">
          <InfoLabel label="Bond Markets">
            {markets}
            <span className="text-[32px]">+</span>
          </InfoLabel>
        </div>
        <div className="grow lg:w-1/3">
          <InfoLabel label="Bonds Issued">
            {bonds}
            <span className="text-[32px]">+</span>
          </InfoLabel>
        </div>
      </div>

      <div className="child:px-4 lg:child:w-1/4 grid grid-cols-2 gap-y-4 py-4 backdrop-blur-md lg:flex">
        <TextBlock
          title="Build"
          titleClassName="text-[25px] font-fraktion"
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
          titleClassName="text-[25px] font-fraktion"
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
          titleClassName="text-[25px] font-fraktion"
          content={
            <p>
              Treasury management to <br /> provide stability through any <br />{" "}
              market conditions
            </p>
          }
        />
        <TextBlock
          title="Deploy"
          titleClassName="text-[25px] font-fraktion"
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
