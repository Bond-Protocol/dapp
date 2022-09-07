import { Button } from "../atoms/Button";
import { ModalTitle } from "../atoms/ModalTitle";
import useBrowserStorage from "../../hooks/useBrowserStorage";

const tcLink = (
  <a href="/tc" target="_blank" className="text-blue-500">
    Terms of Service
  </a>
);
const tcTop = (
  <p>
    Please read our {tcLink} and review the list of restricted countries Bond
    Protocol does not serve.
  </p>
);

const tcBottom = (
  <p className="mt-5">
    By clicking "Accept" you agree to our {tcLink} and confirm you do not live
    in one of the restricted countries Bond Protocol does not serve.
  </p>
);

export const TermsDialog = () => {
  const { getItem, setItem, removeItem } = useBrowserStorage();
  const tc = getItem("tc");

  const acceptTC = () => {
    setItem("tc", JSON.stringify({ accepted: true }));
  };

  const rejectTC = () => {
    removeItem("tc");
  };

  return (
    <div className="text-center">
      <ModalTitle>Terms and Conditions</ModalTitle>
      <div className="mt-5 px-10">
        {tcTop}
        {tcBottom}
      </div>
      <div className="flex justify-between mt-8 h-[40px] gap-2">
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
