import Image from "next/image";

const terms = [
  { label: "Terms of Use", url: "as" },
  { label: "Privacy Policy", url: "as" },
  { label: "Cookie Policy", url: "sd" },
];

export const socials = [
  { label: "Medium", url: "https://medium.com/@Bond_Protocol" },
  { label: "Discord", url: "https://discord.gg/bondprotocol" },
  { label: "Twitter", url: "https://twitter.com/bond_protocol" },
];

export const resources = [
  { label: "Docs", url: "https://docs.bondprotocol.finance" },
  { label: "Github", url: "https://github.com/bond-protocol" },
  { label: "dApp", url: "https://app.bondprotocol.finance" },
];

const List = (props: {
  title: string;
  items: Array<{ url: string; label: string }>;
}) => {
  return (
    <div className="font-jakarta">
      <div className="px-4 font-bold">{props.title}</div>
      <div className="px-4 pt-2">
        {props.items.map(({ url, label }, i) => (
          <a href={url} target="_blank" rel="noreferrer" key={i}>
            <div className="hover:text-light-secondary bp-transition pt-1 font-light">
              {label}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <div className="justify-center bg-black px-8 pt-4 pb-6 font-sans md:pb-12 border-t border-white/20">
      <div className="xs:block w-full pt-8 md:hidden">
        <Image
          height={56}
          width={115}
          alt="bondprotocol_logo"
          src="/logo-long.svg"
        />
      </div>
      <div className="mx-auto grid grid-cols-2 gap-4 pt-10 md:max-w-[1136px] md:grid-cols-4 md:justify-items-center">
        <div className="xs:hidden w-full md:block">
          <Image
            height={56}
            width={115}
            alt="bondprotocol_logo"
            src="/logo-long.svg"
          />
        </div>
        {/*<List title="Terms" items={terms} /> */}
        <List title="Resources" items={resources} />
        <List title="Community" items={socials} />
      </div>
    </div>
  );
};
