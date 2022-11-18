import { useTestnet } from "hooks/useTestnet";
import { environment } from "../../env-state";
import { ReactComponent as AlertIcon } from "../../assets/icons/alert.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";

const dAppLink = "https://app.bondprotocol.finance";

const TestnetMessage = () => (
  <div className="flex w-full justify-center bg-light-secondary">
    <div className="flex text-black ">
      <InfoIcon />
      <div className="my-auto">
        You're on <span className="underline">{window.origin}</span>, a testnet
        environment. You can find the live BondProtocol dApp{" "}
        <a href={dAppLink} className="underline hover:cursor-pointer">
          here
        </a>
        .
      </div>
    </div>
  </div>
);

const WarningMessage = ({ toggleTestnet }: { toggleTestnet: () => void }) => (
  <div className="flex w-full justify-center bg-red-400">
    <AlertIcon />
    <span className="my-auto font-bold">
      You're on a testing environment containing experimental features and bugs
      and <span className="underline">utilizing real markets.</span>{" "}
      Transactions may result in a loss of funds.
      <button className="underline" onClick={toggleTestnet}>
        Click here to load testnet markets.
      </button>
    </span>
    <AlertIcon />
  </div>
);

export const AppStatusCard = () => {
  const { isTestnet, toggleTestnet } = useTestnet();
  const showInfo = environment.isStaging || environment.isTesting;
  const showWarning = showInfo && !isTestnet;

  return (
    <div
      className={`${
        showInfo ? "sticky z-10" : "hidden"
      } inset-0 text-center text-xs`}
    >
      {showWarning ? (
        <WarningMessage toggleTestnet={toggleTestnet} />
      ) : (
        <TestnetMessage />
      )}
    </div>
  );
};
