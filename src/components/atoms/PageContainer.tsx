// @ts-ignore
import { TailwindComponent } from "src/types/TailwindComponent";

export const PageContainer: TailwindComponent = ({
  // @ts-ignore
  children,
  className = "",
}) => {
  return (
    <div
      className={`z-10 mx-auto max-w-[1440px] min-height-[90vh] ${className}`}
    >
      {children}
    </div>
  );
};
