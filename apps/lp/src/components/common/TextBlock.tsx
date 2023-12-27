type TextBlockProps = {
  className?: string;
  titleClassName?: string;
  title?: string;
  content?: string | React.ReactNode;
};

export const TextBlock = ({ className, titleClassName, title, content, ...divProps }: TextBlockProps) => {
  return (
    <div {...divProps} className={`min-w-[160px] ${className}`}>
      <div
        className={`font-fraktion font-bold uppercase lg:text-[25px] ${titleClassName}`}
      >
        {title}
      </div>
      <div className="text-light-grey-400">{content}</div>
    </div>
  );
};
