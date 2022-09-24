import {useState} from "react";
import {Button, Checkbox, Link} from "../atoms";
import {ModalTitle} from "../atoms/ModalTitle";

const verificationLink = (
  <Link
    href="/verify-market"
    target="_blank"
    className="uppercase font-faketion tracking-widest"
  >
    Read the Verification Requirements
  </Link>
);

export const CreateMarketTermsDialog = (props: {
  onAccept: () => void;
  onReject: () => void;
}) => {
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    props.onAccept();
  };
  return (
    <div className="text-center flex flex-col">
      <ModalTitle>Terms of Service</ModalTitle>
      <div className="mt-5 px-6 font-extralight text-sm">
        <p>
          Your market will be live on the contract immediately. If you would
          like your bond to appear on the BondProtocol site, you should submit
          Protocol verification details in advance.
        </p>
        <p>Alternatively, you can provide your own UI, or none at all.</p>
      </div>

      <div className="flex mx-auto mt-5">
        <Checkbox onChange={setChecked} />
        <p className="text-xs my-auto ml-2">
          By checking this box I confirm I have read and understand the terms
          and services
        </p>
      </div>
      <div className="flex flex-col items-center justify-between mt-8 h-[40px] gap-2">
        <Button
          long
          onClick={handleClick}
          className="w-full"
          disabled={!checked}
        >
          I understand
        </Button>
        <Button
          onClick={props.onReject}
          variant="secondary"
          long
          className="w-full"
        >
          Cancel
        </Button>
        <div className="mt-3">{verificationLink}</div>
      </div>
    </div>
  );
};
