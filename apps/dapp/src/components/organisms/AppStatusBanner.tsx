import { environment } from "../../environment";
import AlertIcon from "../../assets/icons/alert.svg?react";
import InfoIcon from "../../assets/icons/info.svg?react";

const dAppLink = "https://app.bondprotocol.finance";

const TestnetMessage = () => (
  <div className="flex w-full justify-center bg-light-secondary">
    <div className="flex text-black ">
      <InfoIcon />
      <div className="my-auto">
        You're on <span className="underline">{window.origin}</span>, a staging
        environment. You can find the live BondProtocol dApp{" "}
        <a href={dAppLink} className="underline hover:cursor-pointer">
          here
        </a>
      </div>
    </div>
  </div>
);

const WarningMessage = ({ toggleTestnet }: { toggleTestnet: () => void }) => (
  <div className="flex w-full justify-center bg-red-700 text-light-secondary-10">
    <AlertIcon />
    <span className="my-auto font-bold">
      You're on a staging environment containing experimental features and bugs
      and <span className="underline">utilizing real markets.</span>{" "}
      Transactions may result in a loss of funds.
    </span>
    <AlertIcon />
  </div>
);

const isTestnet = environment.isTestnet;
export const AppStatusBanner = () => {
  const showInfo = isTestnet;
  const showWarning = !isTestnet && environment.isStaging;

  return (
    <div
      className={`${
        showInfo || showWarning ? "sticky z-10" : "hidden"
      } inset-0 text-center text-xs`}
    >
      {showWarning ? (
        <WarningMessage toggleTestnet={() => {}} />
      ) : (
        <TestnetMessage />
      )}
    </div>
  );
};
