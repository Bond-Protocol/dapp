type Condition = {
  title: string;
  content: string;
};

export type TermsPage = {
  updateDate: string;
  title: string;
  welcome: string | React.ReactNode;
  conditions: Condition[];
};

export const PolicyPage = (props: TermsPage) => {
  return (
    <div className="pt-10 font-jakarta">
      <div className="mx-[10vw]">
        <p className="text-3xl text-brand-yella">Updated: {props.updateDate}</p>
        <p className="font-bold text-5xl pt-2">{props.title}</p>
        <p className="pt-4">{props.welcome}</p>
      </div>
      <div className="my-16 bg-white text-black py-8 pb-16">
        {props.conditions.map(({ title, content }, i) => {
          return (
            <div className="pt-8 mx-[10vw]" key={i}>
              <p className="font-bold text-black">{title}</p>
              <p className="text-light-grey">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
