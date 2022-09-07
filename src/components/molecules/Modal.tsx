import { forwardRef } from "react";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import CloseIcon from "../../assets/icons/close-icon.svg";

type ModalHeaderProps = {
  onClickClose?: () => void;
  topLeftContent?: string | React.ReactNode;
};

export type ModalProps = ModalHeaderProps & {
  open: boolean;
  title?: string;
  children: React.ReactNode;
};

const Backdrop = forwardRef(function ModalContainer(
  props: { children: React.ReactNode },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className="fixed inset-0 backdrop-blur-xl flex justify-center items-center"
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
        <img
          src={CloseIcon}
          onClick={props.onClickClose}
          className="h-[14px] w-[14px] my-auto hover:cursor-pointer"
        />
      )}
    </div>
  );
};

export const Modal = ({ title, ...props }: ModalProps) => {
  return (
    <ModalUnstyled
      componentsProps={{ root: { className: "fixed inset-0" } }}
      open={props.open}
    >
      <Backdrop>
        <div className="w-[405px] border-transparent rounded-lg bg-brand-turtle-blue">
          <ModalHeader
            topLeftContent={props.topLeftContent}
            onClickClose={props.onClickClose}
          />
          <div className="px-5 pb-8 transition-all">{props.children}</div>
        </div>
      </Backdrop>
    </ModalUnstyled>
  );
};
