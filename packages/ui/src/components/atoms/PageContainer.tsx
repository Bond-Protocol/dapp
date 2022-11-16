export const PageContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`min-height-[90vh] z-10 mx-auto max-w-[1440px] ${className}`}
    >
      {children}
    </div>
  );
};
