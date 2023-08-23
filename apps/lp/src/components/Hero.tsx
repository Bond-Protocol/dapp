import { LinkButton } from "./common/LinkButton";
import Image from "next/image";
import data from "../data";
import ArrowRight from "../assets/arrow-right.svg";

export type HeroProps = {
  className?: string;
};

const LinkButtonContent = ({
  label,
  children,
  iconClassName = "",
}: {
  label: string;
  children: React.ReactNode;
  iconClassName?: string;
}) => {
  return (
    <div className="flex justify-center">
      <span className="my-auto">{label}</span>
      {children}
    </div>
  );
};

export const Hero = (props: HeroProps) => {
  return (
    <div className={props.className}>
      <div className="hero-bg mt-12 flex select-none flex-col rounded-xl bg-black/40 p-6 pb-10 backdrop-blur-md lg:mt-0 xl:p-12">
        <div>
          <Image
            alt="bondprotocol_logo"
            height={88}
            width={88}
            src="/logo.svg"
          />
        </div>
        <div className="font-fraktion max-w-[700px] pt-6 text-[25px] font-bold uppercase md:text-3xl lg:text-5xl">
          {
            "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace"
          }
        </div>
        <div className="flex w-full flex-col gap-y-2 pt-10">
          <div className="flex w-full flex-col gap-2 pt-10 md:max-w-[301px] md:flex-row md:self-end">
            <LinkButton href={data.links.docs} variant="ghost" small>
              <LinkButtonContent iconClassName="-rotate-45" label="Read Docs">
                <ArrowRight className="-rotate-45 fill-current text-current" />
              </LinkButtonContent>
            </LinkButton>
            <LinkButton href={data.links.dapp} small>
              <LinkButtonContent label="Bond Now">
                <ArrowRight className="fill-current text-current" />
              </LinkButtonContent>
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};
