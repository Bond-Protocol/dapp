import { ButtonGroup } from "components/molecules/ButtonGroup";

const tcLink = (
  <a href="/tc" target="_blank" className="text-blue-500">
    Terms of Service
  </a>
);

const textContent = (
  <p className="mt-5">
    By clicking &quot;Deploy Market&quot; you agree to our {tcLink} and confirm
    you do not live in one of the restricted countries Bond Protocol does not
    serve.
  </p>
);

export const CreateMarketConfirmDialog = (props: {
  onAccept: () => void;
  onReject: () => void;
}) => {
  return (
    <div className="pb-2 text-left ">
      <p className="mt-2 font-bold">You are about to issue a Bond Market</p>
      <div className="mt-5">{textContent}</div>
      <ButtonGroup
        className="mt-8"
        onClickRight={props.onAccept}
        onClickLeft={props.onReject}
        rightLabel="Deploy Market"
        leftLabel="Cancel"
      />
    </div>
  );
};
