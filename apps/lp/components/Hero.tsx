import { LinkButton } from "./LinkButton";
export type HeroProps = {
  className?: string;
};

export const Hero = (props: HeroProps) => {
  return (
    <div className={props.className}>
      <div className="flex flex-col rounded-xl bg-black/40 p-6 pb-10 backdrop-blur-xl xl:p-12">
        <div>
          <img height={88} width={88} src="/logo.svg" />
        </div>
        <div className="font-fraktion max-w-[700px] pt-6 text-5xl font-bold uppercase ">
          {
            "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace"
          }
        </div>
        <div className="flex w-full flex-col gap-y-2 pt-10">
          <div className="fml:self-end fml:flex-row flex flex-col gap-2 pt-10">
            <LinkButton
              href="https://docs.bondprotocol.finance"
              variant="ghost"
              className="fml:mr-2 w-full"
            >
              {"Read Docs"}
            </LinkButton>
            <LinkButton
              href="https://app.bondprotocol.finance"
              className="fml:mr-2 w-full"
            >
              {"Bond Now"}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};
