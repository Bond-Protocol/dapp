import { TextCard, TextCardProps } from "./TextCard";

export type LongCopyPageProps = {
  title: string;
  intro: string;
  content: Array<TextCardProps>;
  children?: React.ReactNode;
  className?: string;
};

export const LongCopyPage = (props: LongCopyPageProps) => {
  return (
    <div
      className={`min-h-[75vh] flex w-full items-center flex-col bg-black/50 backdrop-blur-md mt-6 mb-20 ${props.className} `}
    >
      <div className="max-w-[937px] flex flex-col gap-y-20">
        <div className="mt-10 w-[80%]">
          <h2 className="text-8xl font-fraktion font-bold">{props.title}</h2>
          <p className="mt-4 text-xl">{props.intro}</p>
        </div>
        {props.content.map((c, i: number) => (
          <TextCard
            title={c.title}
            description={c.description}
            className={
              i % 2 === 0 ? "text-left pr-[30%]" : "text-right pl-[30%]"
            }
          />
        ))}
        {props.children}
      </div>
    </div>
  );
};
