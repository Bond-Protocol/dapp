// @ts-ignore
import { TailwindComponent } from "src/types/TailwindComponent";

export const PageContainer: TailwindComponent = ({
  // @ts-ignore
  children,
  className = "",
}) => {
  return (
    <div
      className={`min-height-[90vh] z-10 mx-auto max-w-[1440px] ${className}`}
    >
      {children}
    </div>
  );
};
