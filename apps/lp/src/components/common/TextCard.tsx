export type TextCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
};

export const TextCard = (props: TextCardProps) => (
  <div className={`${props.className ?? "text-center"}`}>
    <div className="font-fraktion font-bold text-5xl uppercase">
      {props.title}
    </div>
    <div className="text-grey-400 mt-2 text-xl tracking-wide">
      {props.description}
    </div>
  </div>
);
