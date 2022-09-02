export type BackdropProps = {
  children?: React.ReactNode;
};

/**
 * Renders children with a full screen blurred background
 */
export const Backdrop = (props: BackdropProps) => {
  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100vw] backdrop-blur-xl z-20 overflow-hidden">
      {props.children}
    </div>
  );
};
