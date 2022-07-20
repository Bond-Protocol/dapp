import { TailwindComponent } from "src/types/TailwindComponent";

export const PageContainer: TailwindComponent = ({
  children,
  className = "",
}) => {
  return <div className={`mx-[5vw] mt-[5vw] ${className}`}>{children}</div>;
};
