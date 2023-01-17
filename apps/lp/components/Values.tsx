import { TextBlock } from "./TextBlock";

type ValuesProps = {
  className?: string;
};

const content =
  "lorem ipsum ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum";

export const Values = (props: ValuesProps) => {
  return (
    <div
      className={`child:bg-black child:p-4 grid grid-cols-2 gap-y-4 md:pt-8 lg:flex lg:gap-8 ${props.className}`}
    >
      <TextBlock title="Bond" content={content} />
      <TextBlock title="Own" content={content} />
      <TextBlock title="Nurture" content={content} />
      <TextBlock title="Deploy" content={content} />
    </div>
  );
};
