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
      className="fixed inset-0 flex items-center justify-center outline-0 backdrop-blur-lg"
    >
      {props.children}
    </div>
  );
});

const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <div className="flex justify-between p-5">
      <p className="font-light tracking-wider">{props?.topLeftContent}</p>
      {props.onClickClose && (
        <div onClick={props.onClickClose}>
          <CloseIcon className="my-auto h-[14px] w-[14px] fill-white hover:cursor-pointer" />
        </div>
      )}
    </div>
  );
};

const ModalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border-transparent bg-light-primary-900">
      <div id="grad-1" className="rounded-lg border-transparent">
        <div id="grad-2" className="rounded-lg border-transparent">
          {children}
        </div>
      </div>
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
        <ModalBackground>
          <div className={`${props.large ? "w-[576px] pb-20" : "w-[405px]"} `}>
            <ModalHeader
              topLeftContent={props.topLeftContent}
              onClickClose={props.onClickClose}
            />
            <div className="px-5 pb-8 transition-all">{props.children}</div>
          </div>
        </ModalBackground>
      </ModalBackdrop>
    </ModalUnstyled>
  );
};
