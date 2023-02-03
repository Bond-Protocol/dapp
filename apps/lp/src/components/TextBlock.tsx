type TextBlockProps = {
  className?: string;
  titleClassName?: string;
  title?: string;
  content?: string | React.ReactNode;
};

export const TextBlock = (props: TextBlockProps) => {
  return (
    <div {...props} className={`min-w-[160px] ${props.className}`}>
      <div
        className={`font-bold uppercase lg:text-[25px] ${props.titleClassName}`}
      >
        {props.title}
      </div>
      <div className="text-light-grey-400">{props.content}</div>
    </div>
  );
};
