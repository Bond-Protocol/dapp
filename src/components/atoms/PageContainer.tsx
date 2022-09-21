// @ts-ignore
import { TailwindComponent } from "src/types/TailwindComponent";

export const PageContainer: TailwindComponent = ({
  // @ts-ignore
  children,
  className = "",
}) => {
  return (
    <div className={`z-10 mx-[10vw] min-h-[78vh] ${className}`}>{children}</div>
  );
};
