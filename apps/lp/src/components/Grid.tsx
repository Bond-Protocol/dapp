import Image from "next/image";

export type CardProps = {
  logoUrl: string;
  url?: string;
  name?: string;
  className?: string;
};

export type GridProps = {
  className?: string;
  gridClassName?: string;
  title: string;
  description?: string;
  content?: Array<CardProps>;
  big?: boolean;
};

export const Card = ({ logoUrl, url, name, className }: CardProps) => {
  return (
    <a
      href={`https://app.bondprotocol.finance/#/issuers/${name}`}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className={`flex h-[76px] w-[160px] cursor-pointer group max-w-[160px] flex-col items-center justify-center bg-white/5 backdrop-blur-lg lg:w-[200px] lg:max-w-[200px] lg:flex-row ${className}`}
      >
        <div className="h-8 md:w-1/3">
          <Image
            alt={`${name}_logo`}
            className="mx-auto my-auto h-full rounded-full"
            width={32}
            height={32}
            src={logoUrl}
          />
        </div>
        <div className="select-none text-center md:w-2/3 lg:text-left font-bold lg:-ml-3">
          <p className="group-hover:hidden"> {name} </p>
          <p className="hidden group-hover:block text-light-secondary">
            Go to Market
          </p>
        </div>
      </div>
    </a>
  );
};

export const BiggerCard = ({ logoUrl, url, name, className }: CardProps) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div
        className={`flex h-[148px] cursor-pointer group w-[368px] max-w-[368px] flex-col items-center justify-center bg-white/5 backdrop-blur-lg lg:w-[368px] lg:max-w-[368px] ${className}`}
      >
        <div className="h-[88px]">
          <Image
            alt={`${name}_logo`}
            className="mx-auto my-auto h-full rounded-full"
            width={88}
            height={88}
            src={logoUrl}
          />
        </div>
        <div className="select-none text-center font-bold pt-1">
          <p className="group-hover:hidden"> {name} </p>
          <p className="hidden group-hover:block text-light-secondary">
            Visit Website
          </p>
        </div>
      </div>
    </a>
  );
};

export const Grid = (props: GridProps) => {
  const Element = props.big ? BiggerCard : Card;
  return (
    <div className={`bp-max-w mx-auto ${props.className}`}>
      <div className="font-fraktion text-center text-5xl font-bold uppercase">
        {props.title}
      </div>
      <div className="text-grey-400 pt-2 text-center">{props.description}</div>
      <div
        className={`flex flex-wrap justify-center gap-4 pt-10 ${props.gridClassName}`}
      >
        {props.content?.map((c, i) => (
          <Element {...c} key={i} />
        ))}
      </div>
    </div>
  );
};
