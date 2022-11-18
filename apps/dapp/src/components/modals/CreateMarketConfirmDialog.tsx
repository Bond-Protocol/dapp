import { Button, ModalTitle } from "ui";

const tcLink = (
  <a href="/tc" target="_blank" className="text-blue-500">
    Terms of Service
  </a>
);

const textContent = (
  <p className="mt-5">
    By clicking &quot;Deploy Bond&quot; you agree to our {tcLink} and confirm
    you do not live in one of the restricted countries Bond Protocol does not
    serve.
  </p>
);

export const CreateMarketConfirmDialog = (props: {
  onAccept: () => void;
  onReject: () => void;
}) => {
  return (
    <div className="pb-8 text-center">
      <ModalTitle>Terms of Service</ModalTitle>
      <p className="mt-5">You are about to issue a Bond Market</p>
      <div className="mt-5 px-10">{textContent}</div>
      <div className="mt-8 flex h-[40px] flex-col justify-between gap-2">
        <Button onClick={props.onAccept} long className="w-full">
          Deploy Bond
        </Button>
        <Button
          onClick={props.onReject}
          variant="secondary"
          long
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
