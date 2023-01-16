export type CardProps = {
  logoUrl: string;
  name?: string;
};

export type GridProps = {
  className?: string;
  gridClassName?: string;
  title: string;
  description?: string;
  content?: Array<CardProps>;
};

export const Card = ({ logoUrl, name }: CardProps) => {
  return (
    <div className="flex min-h-[76px] w-full flex-col items-center justify-center bg-white/5 backdrop-blur-lg">
      <div className="h-8">
        <img
          className="mx-auto my-auto h-full rounded-full"
          width={32}
          height={32}
          src={logoUrl}
        />
      </div>
      <div className="text-light-primary-200 text-center">{name}</div>
    </div>
  );
};

export const Grid = (props: GridProps) => {
  return (
    <div className={props.className}>
      <div className="font-fraktion text-center text-5xl font-bold uppercase">
        {props.title}
      </div>
      <div className="text-grey-400 pt-2 text-center">{props.description}</div>
      <div className={"grid gap-4 pt-10 " + props.gridClassName}>
        {props.content?.map((c, i) => (
          <Card {...c} key={i} />
        ))}
      </div>
    </div>
  );
};
