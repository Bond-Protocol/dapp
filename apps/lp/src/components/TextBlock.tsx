type TextBlockProps = {
  className?: string;
  tileClassName?: string;
  title?: string;
  content?: string | React.ReactNode;
};

export const TextBlock = (props: TextBlockProps) => {
  return (
    <div {...props} className={`min-w-[160px] ${props.className}`}>
      <div
        className={`lg:font-fraktion font-bold uppercase lg:text-[25px] ${props.tileClassName}`}
      >
        {props.title}
      </div>
      <div className="text-light-grey-400">{props.content}</div>
    </div>
  );
};
