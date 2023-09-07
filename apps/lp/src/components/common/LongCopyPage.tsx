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
      className={`mb-20 mt-6 flex min-h-[75vh] w-full flex-col items-center bg-black/50 backdrop-blur-md ${props.className} `}
    >
      <div className="text-light-grey-400 flex max-w-[937px] flex-col gap-y-20">
        <div className="mt-10 w-[80%]">
          <h2 className="font-fraktion text-8xl font-bold">{props.title}</h2>
          <p className="mt-4 text-xl">{props.intro}</p>
        </div>
        {props.content.map((c, i: number) => (
          <TextCard
            key={i}
            title={c.title}
            description={c.description}
            className={
              i % 2 === 0 ? "pr-[30%] text-left" : "pl-[30%] text-right"
            }
          />
        ))}
        {props.children}
      </div>
    </div>
  );
};
