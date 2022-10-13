import {Button} from "../atoms/Button";
import {ModalTitle} from "../atoms/ModalTitle";
import useBrowserStorage from "../../hooks/useBrowserStorage";

const tcLink = (
  <a href="/terms" target="_blank" className="text-blue-500">
    Terms of Use
  </a>
);
const tcTop = <p>This dApp is in βeta. </p>;
const tcMid = <p>Use at your own risk.</p>;

const tcBottom = (
  <p className="mt-5">
    By clicking &quot;Accept&quot; you agree to our {tcLink}.
  </p>
);

export const GeneralTermsDialog = (props: { onAccept: () => void }) => {
  const { setItem, removeItem } = useBrowserStorage();

  const acceptTC = () => {
    setItem("tc", JSON.stringify({ accepted: true }));
    props.onAccept && props.onAccept();
  };

  const rejectTC = () => {
    removeItem("tc");
    window.location.replace("http://www.bondprotocol.finance");
  };

  return (
    <div className="text-center">
      <ModalTitle>Terms of Use</ModalTitle>
      <div className="mt-5 px-10">
        {tcTop}
        {tcMid}
        {tcBottom}
      </div>
      <div className="mt-8 flex h-[40px] justify-between gap-2">
        <Button onClick={rejectTC} variant="secondary" long className="w-1/2">
          Decline
        </Button>
        <Button onClick={acceptTC} long className="w-1/2">
          Accept
        </Button>
      </div>
    </div>
  );
};
