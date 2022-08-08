// @ts-ignore
import {TailwindComponent} from "src/types/TailwindComponent";

export const PageContainer: TailwindComponent = ({
  // @ts-ignore
  children,
  className = "",
}) => {
  return <div className={`mx-[5vw] mt-[5vw] ${className}`}>{children}</div>;
};
