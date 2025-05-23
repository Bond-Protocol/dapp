import { forwardRef } from "react";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import { ClickAwayListener } from "@mui/base";

type ModalHeaderProps = {
  onClickClose: (e: React.BaseSyntheticEvent) => void;
  topLeftContent?: string | React.ReactNode;
};

export type ModalProps = ModalHeaderProps & {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  large?: boolean;
};

export const ModalBackdrop = forwardRef(function ModalContainer(
  props: { children: React.ReactNode },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      tabIndex={-1}
      ref={ref}
      className="fixed inset-0 flex items-center justify-center outline-0 backdrop-blur-lg"
    >
      {props.children}
    </div>
  );
});

export const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <div className="text-light-secondary fill-light-secondary flex select-none items-center justify-between p-2 pt-1">
      <p
        data-testid="modal-title"
        className="font-fraktion my-auto p-2 font-bold uppercase tracking-wide"
      >
        {props?.topLeftContent}
      </p>
      {props.onClickClose && (
        <div onClick={props.onClickClose} className="my-auto pr-1">
          <CloseIcon className="my-auto h-[14px] w-[14px] hover:cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export const ModalBackground = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-light-black rounded-lg border-transparent">
      {children}
    </div>
  );
};

export const Modal = ({ title, ...props }: ModalProps) => {
  return (
    <ModalUnstyled
      componentsProps={{
        root: { className: "fixed inset-0 z-20" },
        backdrop: { className: "outline-0 bg-none" },
      }}
      open={props.open}
    >
      <ModalBackdrop>
        <ModalBackground>
          {/*@ts-ignore*/}
          <ClickAwayListener onClickAway={(e) => props.onClickClose(e)}>
            <div className={`min-w-[320px] md:max-w-[650px]`}>
              <ModalHeader
                topLeftContent={title}
                onClickClose={props.onClickClose}
              />
              <div className="text-light-secondary-10 px-5 pb-6 transition-all">
                {props.children}
              </div>
            </div>
          </ClickAwayListener>
        </ModalBackground>
      </ModalBackdrop>
    </ModalUnstyled>
  );
};
