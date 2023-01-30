import { LinkButton } from "./LinkButton";
import Image from "next/image";
import data from "../data";

const Navlink = (props: { url: string; label: string }) => {
  return (
    <a
      href={props.url}
      className="hover:text-light-secondary bp-transition my-auto font-mono uppercase"
    >
      {props.label}
    </a>
  );
};

const links = [
  { url: data.links.docs, label: "Docs" },
  { url: data.links.audits, label: "Security" },
  { url: data.links.medium, label: "Blog" },
];

export const Navbar = () => {
  return (
    <div className="navbar-bg z-40 bg-black/40 p-4 px-4 md:py-8">
      <div className="mx-auto flex max-w-[400px] justify-between md:max-w-[1440px]">
        <Image
          width={115}
          height={56}
          alt="bondprotocol_logo"
          src="/logo-long.svg"
        />
        <div className="hidden w-min gap-x-5 md:flex">
          {links.map((l, i) => (
            <Navlink {...l} key={i} />
          ))}
        </div>
        <div>
          <LinkButton
            className="xs:text-[10px] mx-0 md:text-[14px]"
            href="https://app.bondprotocol.finance"
            target="_blank"
            variant="ghost"
            small
          >
            <div className="flex">
              <span className="my-auto">Launch dApp</span>
              <Image
                height={24}
                width={24}
                src="/arrow-right.svg"
                alt="external_link_icon"
                className="my-auto"
              />
            </div>
          </LinkButton>
        </div>
      </div>
    </div>
  );
};
