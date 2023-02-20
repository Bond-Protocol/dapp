import {useNavigate, useParams} from "react-router-dom";
import {getProtocolByAddress, Protocol} from "@bond-protocol/bond-library";
import {useEffect, useState} from "react";
import {getBlockExplorer} from "@bond-protocol/contract-library";
import {Button} from "ui";
import {providers} from "services/owned-providers";
import {MarketOwnerAllowanceForm} from "components/common/MarketOwnerAllowanceForm";

export type MarketCreatedParams = {
  marketData: any;
};

export const MarketCreated = (props: MarketCreatedParams) => {
  const {hash} = useParams();
  const navigate = useNavigate();

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createTx, setCreateTx] = useState<any>();
  const [ownerAddress, setOwnerAddress] = useState(
    props.marketData.formValues.marketOwnerAddress
  );

  providers[props.marketData.chain]
    .waitForTransaction(hash || "")
    .then((result) => {
      if (result.status === 1) {
        setCreateTx(result);
      }
    });

  const {
    blockExplorerUrl: blockExplorerUrl,
    blockExplorerName: blockExplorerName,
  } = getBlockExplorer(props.marketData.chain, "tx");

  useEffect(() => {
    if (createTx && !(createTx.status === 0) && isLoading) {
      setProtocol(getProtocolByAddress(ownerAddress, props.marketData.chain));
      setOwnerAddress(
        props.marketData.isMultisig ? createTx.to : createTx.from
      );
      setIsLoading(false);
    }
  }, [createTx, isLoading]);

  return (
    <div className="mx-[15vw]">
      {isLoading && (
        <div className="py-4 text-center text-xl leading-normal">
          Waiting for tx confirmation...
        </div>
      )}
      {!isLoading && createTx && !(createTx.status === 0) && (
        <div>
          <h1 className="font-faketion py-10 text-center text-5xl leading-normal">
            ALL SET!
            <br/>
            YOUR BOND MARKET
            <br/>
            HAS BEEN DEPLOYED
          </h1>

          {ownerAddress && protocol ? (
            <div>
              <h2 className="py-4 text-center text-xl leading-normal text-green-500">
                Owner verified as {protocol.name}!
              </h2>

              <p className="pb-4 text-center leading-normal text-green-500">
                ({ownerAddress})
              </p>

              <p className="py-8 text-center leading-normal">
                Your market is live on the contract, it should appear in our
                market list as soon as it has been indexed by our subgraph.
              </p>

              <MarketOwnerAllowanceForm marketData={props.marketData}/>

              <Button
                className="font-faketion mt-5 w-full"
                onClick={() => navigate("/issuers/" + protocol.name)}
              >
                {`Go to ${protocol.name} page`}
              </Button>
            </div>
          ) : (
            <div>
              <p className="py-8 text-center leading-normal">
                Your market is live on the contract, however we cannot find
                protocol details for the owner address {ownerAddress}.
              </p>

              <p className="py-8 text-center leading-normal">
                In order for BondProtocol to display your market on our site,
                you must verify your protocol details with us. If you have not
                done so already, click below to start the process.
              </p>

              <p className="py-8 text-center leading-normal">
                If this is not done, the market will still be live, but users
                will need to access it directly via the contract, or via your
                own UI.
              </p>

              <MarketOwnerAllowanceForm marketData={props.marketData}/>

            </div>
          )}
        </div>
      )}
      {createTx && createTx.status === 0 && (
        <div className="py-8 text-center leading-normal">Error!</div>
      )}
      <Button
        className="font-faketion mt-5 w-full"
        onClick={() =>
          window.open(blockExplorerUrl + "/" + hash, "_blank", "noreferrer")
        }
      >
        {`View tx on ${blockExplorerName}`}
      </Button>
    </div>
  );
};
