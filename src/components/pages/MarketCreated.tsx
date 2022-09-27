import {useWaitForTransaction} from "wagmi";
import {useNavigate, useParams} from "react-router-dom";
import {getBlockExplorer} from "../../utils";
import {getProtocolByAddress} from "@bond-protocol/bond-library";
import Button from "../atoms/Button";

export const MarketCreated = () => {
  const {chainId, hash} = useParams();
  const navigate = useNavigate();

  const {data, isError, isLoading} = useWaitForTransaction(
    {
      chainId: Number(chainId),
      hash: hash,
    });

  const {blockExplorerUrl: blockExplorerUrl, blockExplorerName: blockExplorerName} = getBlockExplorer(
    chainId || "",
    "tx"
  );

  console.log(data);

  return (
    <div>
      {isLoading &&
        <div className="text-xl text-center py-4 leading-normal">
          Waiting for tx confirmation...
        </div>
      }
      {!isLoading && !isError &&
        <div>
          <h1 className="text-5xl text-center font-faketion py-10 leading-normal">
            ALL SET!
            <br/>
            YOUR BOND MARKET
            <br/>
            HAS BEEN DEPLOYED
          </h1>

          {data?.from && getProtocolByAddress(data.from, "goerli") ?
            (
              <div>
                <h2 className="text-xl text-center py-4 leading-normal">
                  Owner verified as {getProtocolByAddress(data.from, "goerli")?.name}!
                </h2>
                <p className="text-center py-8 leading-normal">
                  Your market is live on the contract, it should appear in our market list as soon as it has been indexed by our subgraph.
                </p>
                <Button className="w-full font-fraktion mt-5"
                        onClick={
                          () => navigate("/issuers/" + getProtocolByAddress(data.from, "goerli")?.name)
                        }>
                  {`Go to ${getProtocolByAddress(data.from, "goerli")?.name} page`}
                </Button>

                <Button className="w-full font-fraktion mt-5"
                        onClick={
                          () => window.open(blockExplorerUrl + "/" + hash, "_blank", "noreferrer")
                        }>
                  {`View tx on ${blockExplorerName}`}
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-center py-8 leading-normal">
                  Your market is live on the contract, however we cannot find protocol details for the owner
                  address {data?.from}.
                </p>
                <p className="text-center py-8 leading-normal">
                  In order for BondProtocol to display your market on our site, you must verify your protocol
                  details with us. If you have not done so already, click below to start the process.
                </p>
                <p className="text-center py-8 leading-normal">
                  If this is not done, the market will still be live, but users will need to access it directly
                  via the contract, or via your own UI.
                </p>
              </div>
            )
          }
        </div>
      }
      {isError &&
        <div className="text-center py-8 leading-normal">
          Error!
        </div>
      }
    </div>
  );
};
