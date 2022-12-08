export const PageContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`z-10 mx-auto h-full max-w-[1440px] ${className}`}>
      {children}
    </div>
  );
};
