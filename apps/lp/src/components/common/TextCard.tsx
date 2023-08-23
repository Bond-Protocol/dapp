export const TextCard = (props: {
  title: string;
  description: string;
  className?: string;
}) => (
  <div className={`px-16 ${props.className ?? "text-center"}`}>
    <div className="font-fraktion font-bold text-5xl font-light uppercase">
      {props.title}
    </div>
    <div className="text-grey-400 pt-2 text-xl">{props.description}</div>
  </div>
);
