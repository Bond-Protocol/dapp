import { forwardRef } from "react";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";

type ModalHeaderProps = {
  onClickClose?: () => void;
  topLeftContent?: string | React.ReactNode;
};

export type ModalProps = ModalHeaderProps & {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  large?: boolean;
};

const ModalBackdrop = forwardRef(function ModalContainer(
  props: { children: React.ReactNode },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className="fixed inset-0 backdrop-blur-lg flex justify-center items-center outline-0"
    >
      {props.children}
    </div>
  );
});

const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <div className="p-5 flex justify-between">
      <p className="tracking-wider font-light">{props?.topLeftContent}</p>
      {props.onClickClose && (
        <div onClick={props.onClickClose}>
          <CloseIcon className="h-[14px] fill-white w-[14px] my-auto hover:cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export const Modal = ({ title, ...props }: ModalProps) => {
  return (
    <ModalUnstyled
      componentsProps={{
        root: { className: "fixed inset-0" },
        backdrop: { className: "outline-0 bg-none" },
      }}
      open={props.open}
    >
      <ModalBackdrop>
        <div
          className={`${
            props.large ? "w-[576px] pb-20" : "w-[405px]"
          } border-transparent rounded-lg bg-brand-turtle-blue`}
        >
          <ModalHeader
            topLeftContent={props.topLeftContent}
            onClickClose={props.onClickClose}
          />
          <div className="px-5 pb-8 transition-all">{props.children}</div>
        </div>
      </ModalBackdrop>
    </ModalUnstyled>
  );
};
