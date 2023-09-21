import { LimitOrderFallback } from "./LimitOrderFallback";

export const RequiresLimitOrderSupport = (props: {
  children: React.ReactNode;
  isSupported: boolean;
  onClick?: () => void;
}) => {
  return (
    <>
      {props.isSupported ? (
        props.children
      ) : (
        <LimitOrderFallback onClick={props.onClick} />
      )}
    </>
  );
};
