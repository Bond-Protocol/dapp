export const Background = ({
  children,
  height,
}: {
  children?: React.ReactNode;
  height: number;
}) => {
  return (
    <div style={{ height: height + "px" }} className="absolute h-fit w-full ">
      <div className={`main-bg-fill absolute h-full w-full`}>
        <div className="main-bg h-full w-full" />
        <div className="main-bg-fade absolute inset-0 h-full w-full" />
      </div>
      <div className="">{children}</div>
    </div>
  );
};
