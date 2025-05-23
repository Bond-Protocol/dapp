import { LinkButton } from "./LinkButton";
import Link from "next/link";
import Image from "next/image";
import data from "../../data";
import { NavLink, NavMenu } from "./";

const sublinks = [
  { url: "/mission", label: "Mission" },
  { url: "/journey", label: "Journey" },
  { url: "/products", label: "Products" },
];

const links = [
  { url: "", label: "About", links: sublinks, type: "menu" },
  { url: data.links.medium, label: "Blog", external: true },
  { url: data.links.docs, label: "Docs", external: true },
  { url: data.links.audits, label: "Security", external: true },
  { url: "/hello", label: "Contact Us" },
];

export const Navbar = () => {
  return (
    <div className="navbar-bg fixed z-40 w-full bg-black bg-black/40 p-4 px-4 md:py-8">
      <div className="mx-auto flex max-w-[400px] justify-between md:max-w-[1440px]">
        <Link className="my-auto" href="/">
          <Image
            width={115}
            height={56}
            alt="bondprotocol_logo"
            src="/logo-long.svg"
          />
        </Link>
        <div className="hidden w-fit gap-x-9 md:flex">
          {links.map((l, i) =>
            l.type === "menu" ? (
              <NavMenu {...l} />
            ) : (
              <NavLink {...l} key={i} className="" />
            )
          )}
        </div>
        <div>
          <LinkButton
            className="xs:text-[10px] mx-0 md:text-[14px]"
            href="https://app.bondprotocol.finance"
            target="_blank"
            small
          >
            <div className="flex">
              <span className="my-auto">Launch App</span>
              <Image
                height={24}
                width={24}
                src="/arrow-right-black.svg"
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
