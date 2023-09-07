export const Background = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="absolute h-max w-full ">
      <div className={`main-bg-fill absolute h-full w-full`}>
        <div className="main-bg h-full w-full" />
        <div className="main-bg-fade absolute inset-0 h-full w-full" />
      </div>
      <div className="">{children}</div>
    </div>
  );
};
