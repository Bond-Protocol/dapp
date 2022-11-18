export const Loading = ({ content }: { content: string }) => {
  return (
    <div className="font-faketion mt-20 text-center uppercase">
      <h1 className="text-5xl leading-normal">
        Hang on, <br />
        loading {content}
      </h1>
    </div>
  );
};
