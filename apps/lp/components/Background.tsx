export const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-bg-fill">
      <div className="main-bg">
        <div className="isolate">{children}</div>
      </div>
    </div>
  );
};
