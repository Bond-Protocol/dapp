import spinner from "../../assets/spinner.gif";
export const Loading = ({ content }: { content: string }) => {
  return (
    <div className="text-center text-5xl font-faketion pt-[20vh]">
      <img src={spinner} width="52" className="mx-auto" />
      Hang on, <br />
      loading {content}
    </div>
  );
};
