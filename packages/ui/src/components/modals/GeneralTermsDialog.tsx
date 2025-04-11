//@ts-nocheck
import { ButtonGroup } from "../../components/molecules/ButtonGroup";
//import useBrowserStorage from "../../hooks/useBrowserStorage";

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
  const { setItem, removeItem } = {
    setItem: (a, b) => {},
    removeItem: (s) => {},
  }; //useBrowserStorage();

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
      <div className="mt-5 px-10">
        {tcTop}
        {tcMid}
        {tcBottom}
      </div>
      <ButtonGroup
        className="mt-4"
        onClickLeft={rejectTC}
        leftLabel="Decline"
        onClickRight={acceptTC}
        rightLabel="Accept"
      />
    </div>
  );
};
