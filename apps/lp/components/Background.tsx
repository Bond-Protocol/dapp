export const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="isolate">{children}</div>
        </div>
      </div>
    </div>
  );
};
