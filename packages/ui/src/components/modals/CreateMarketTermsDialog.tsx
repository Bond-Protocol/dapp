import { useState } from "react";
import { Checkbox, Link } from "components/atoms";
import { ButtonGroup } from "components/molecules/ButtonGroup";

const verificationLink = (
  <Link
    href="/verify-market"
    target="_blank"
    className="text-light-secondary my-4 mx-auto text-sm uppercase"
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
    <div className="flex flex-col text-center">
      <div className="px-6 text-sm font-extralight">
        <p>
          Your market will be live on the contract immediately. <br /> If you
          would like your bond to appear on the BondProtocol site, you should
          submit Protocol verification details in advance.
        </p>
        <p>Alternatively, you can provide your own UI, or none at all.</p>
      </div>
      {verificationLink}
      <div className="mx-8 flex">
        <Checkbox className="w-10" onChange={setChecked} />
        <p className="my-auto ml-2 text-xs">
          By checking this box I confirm I have read and understand the terms
          and services
        </p>
      </div>
      <ButtonGroup
        className="mt-4 w-full"
        onClickLeft={props.onReject}
        onClickRight={handleClick}
        leftLabel="Cancel"
        rightLabel="I understand"
      />
    </div>
  );
};
