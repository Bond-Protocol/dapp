type TextBlockProps = {
  className?: string;
  title?: string;
  content?: string;
};

export const TextBlock = (props: TextBlockProps) => {
  return (
    <div className={`pr-2 ${props.className}`}>
      <div className="font-fraktion text-[25px] font-bold uppercase">
        {props.title}
      </div>
      <div className="text-light-grey-400 pr-2">{props.content}</div>
    </div>
  );
};
