export const Loading = ({ content }: { content: string }) => {
  return (
    <div className="font-fraktion mt-20 text-center font-bold uppercase">
      <h1 className="text-5xl leading-normal">
        Hang on, <br />
        loading {content}
      </h1>
    </div>
  );
};
