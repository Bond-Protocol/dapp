import { LinkButton } from "./LinkButton";
export type HeroProps = {
  className?: string;
};

export const Hero = (props: HeroProps) => {
  return (
    <div className={props.className}>
      <div className="hero-bg mt-12 flex select-none flex-col rounded-xl bg-black/40 p-6 pb-10 backdrop-blur-xl lg:mt-0 xl:p-12">
        <div>
          <img height={88} width={88} src="/logo.svg" />
        </div>
        <div className="font-fraktion max-w-[700px] pt-6 text-[25px] font-bold uppercase md:text-3xl lg:text-5xl">
          {
            "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace"
          }
        </div>
        <div className="flex w-full flex-col gap-y-2 pt-10">
          <div className="flex w-full flex-col gap-2 pt-10 md:max-w-[301px] md:flex-row md:self-end">
            <LinkButton
              href="https://docs.bondprotocol.finance"
              variant="ghost"
              small
            >
              {"Read Docs"}
            </LinkButton>
            <LinkButton href="https://app.bondprotocol.finance" small>
              {"Bond Now"}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};
