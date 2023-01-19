export type CardProps = {
  logoUrl: string;
  name?: string;
  className?: string;
};

export type GridProps = {
  className?: string;
  gridClassName?: string;
  title: string;
  description?: string;
  content?: Array<CardProps>;
};

export const Card_old = ({ logoUrl, name, className }: CardProps) => {
  return (
    <div
      className={`flex min-h-[76px] w-full max-w-[120px] flex-col items-center justify-center bg-white/5 text-center backdrop-blur-lg lg:min-w-[200px] lg:max-w-[200px] lg:flex-row lg:text-left ${className}`}
    >
      <div className="h-8 w-1/3">
        <img
          className="mx-auto my-auto mr-2 h-full rounded-full"
          width={32}
          height={32}
          src={logoUrl}
        />
      </div>
      <div className="text-light-primary-200 w-2/3 text-left">{name}</div>
    </div>
  );
};

export const Card = ({ logoUrl, name, className }: CardProps) => {
  return (
    <div
      className={`flex h-[76px] w-[200px] max-w-[200px] flex-col items-center justify-center bg-white/5 backdrop-blur-lg lg:flex-row ${className}`}
    >
      <div className="h-8 md:w-1/3">
        <img
          className="mx-auto my-auto h-full rounded-full"
          width={32}
          height={32}
          src={logoUrl}
        />
      </div>
      <div className="text-light-primary-200 select-none text-center md:w-2/3 lg:text-left">
        {name}
      </div>
    </div>
  );
};

export const Grid = (props: GridProps) => {
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
          <Card {...c} key={i} />
        ))}
      </div>
    </div>
  );
};
