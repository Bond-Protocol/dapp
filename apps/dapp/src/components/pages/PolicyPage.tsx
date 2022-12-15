type Condition = {
  title: string;
  content: string | React.ReactNode;
};

export type TermsPage = {
  updateDate: string;
  title: string;
  welcome: string | React.ReactNode;
  conditions: Condition[];
};

export const PolicyPage = (props: TermsPage) => {
  return (
    <div className="pt-10 pb-10 font-jakarta">
      <div className="mx-[10vw]">
        <p className="text-3xl text-light-secondary">
          Effective: {props.updateDate}
        </p>
        <p className="pt-2 text-5xl font-bold">{props.title}</p>
        <p className="pt-4">{props.welcome}</p>
      </div>
      <div className="my-16 bg-white py-8 pb-16 text-black">
        {props.conditions.map(({ title, content }, i) => {
          return (
            <div className="mx-[10vw] pt-14" key={i}>
              <p className="text-[24px] font-bold text-black">{title}</p>
              <p className="mt-2 text-light-grey">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
