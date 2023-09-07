import Image from "next/image";

export type CardProps = {
  logoUrl: string;
  url?: string;
  name?: string;
  homepage?: string;
  className?: string;
  hasHover?: boolean;
};

export type GridProps = {
  className?: string;
  gridClassName?: string;
  title: string;
  description?: string;
  content?: Array<CardProps>;
  big?: boolean;
};

export const Card = ({
  logoUrl,
  url,
  homepage,
  name,
  className,
  hasHover,
}: CardProps) => {
  return (
    <a href={homepage} target="_blank" rel="noreferrer">
      <div
        className={`group flex h-[76px] w-[160px] max-w-[160px] cursor-pointer flex-col items-center justify-center bg-white/5 backdrop-blur-lg hover:bg-white/10 lg:w-[200px] lg:max-w-[200px] lg:flex-row ${className}`}
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
        <div className="select-none text-center font-bold md:w-2/3 lg:-ml-3 lg:text-left">
          <p className={!hasHover ? "group-hover:hidden" : ""}> {name} </p>
          {!hasHover && (
            <p className="text-light-secondary hidden group-hover:block">
              Visit website
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

export const BiggerCard = ({
  logoUrl,
  url,
  name,
  className,
  hasHover,
}: CardProps) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div
        className={`group flex h-[148px] w-[368px] max-w-[368px] cursor-pointer flex-col items-center justify-center bg-white/5 backdrop-blur-lg hover:bg-white/10 lg:w-[368px] lg:max-w-[368px] ${className}`}
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
        <div className="select-none pt-1 text-center font-bold">
          <p className="group-hover:hidden"> {name} </p>
          <p className="text-light-secondary hidden group-hover:block">
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
