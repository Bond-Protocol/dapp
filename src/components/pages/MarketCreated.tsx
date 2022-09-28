import {useSigner, useWaitForTransaction} from "wagmi";
import {useNavigate, useParams} from "react-router-dom";
import {getBlockExplorer} from "../../utils";
import {getProtocolByAddress, Protocol} from "@bond-protocol/bond-library";
import Button from "../atoms/Button";
import * as React from "react";
import {useEffect, useState} from "react";
import {usePurchaseBond} from "hooks";
import * as contractLibrary from "@bond-protocol/contract-library";
import {Input} from "components";
import {useForm} from "react-hook-form";

export type MarketCreatedParams = {
  marketData: any;
};

export const MarketCreated = (props: MarketCreatedParams) => {
  const {hash} = useParams();
  const navigate = useNavigate();
  const {getAllowance} = usePurchaseBond();
  const {register, handleSubmit} = useForm();
  const {data: signer} = useSigner();

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [allowance, setAllowance] = useState(-1);
  const [allowanceTx, setAllowanceTx] = useState("");
  const {data, isLoading} = useWaitForTransaction(
    {
      chainId: props.marketData.chainId,
      hash: hash,
    });

  const {
    isLoading: allowanceIsLoading,
  } = useWaitForTransaction(
    {
      chainId: props.marketData.chainId,
      hash: allowanceTx,
      onSuccess(allowanceData) {
        loadAllowance(data?.from || "");
      }
    });

  const {blockExplorerUrl: blockExplorerUrl, blockExplorerName: blockExplorerName} = getBlockExplorer(
    props.marketData.chain,
    "tx"
  );

  const loadAllowance = (from: string) => {
    const auctioneer = contractLibrary.getAddressesForType(
      props.marketData.chain,
      props.marketData.bondType
    ).auctioneer;

    getAllowance(
      props.marketData.marketParams.payoutToken,
      from,
      auctioneer,
      props.marketData.chain,
      props.marketData.payoutToken.decimals,
    ).then((result) => {
      setAllowance(Number(result));
    });
  }

  const onSubmit = async (data: any) => {
    const auctioneer = contractLibrary.getAddressesForType(
      props.marketData.chain,
      props.marketData.bondType
    ).auctioneer;

    const tx = await contractLibrary.changeApproval(
      props.marketData.marketParams.payoutToken,
      props.marketData.payoutToken.decimals,
      auctioneer,
      data.amount,
      // @ts-ignore
      signer
    );

    setAllowanceTx(tx.hash);
  }

  useEffect(() => {
    if (data && !(data.status === 0) && !isLoading) {
      setProtocol(getProtocolByAddress(data.from, props.marketData.chain));
      loadAllowance(data?.from);
    }
  }, [data, isLoading, allowanceTx]);

  const displayAllowance = () => {
    switch (allowance) {
      case -1:
        return;
      case 0:
        const teller = contractLibrary.getAddressesForType(
          props.marketData.chain,
          props.marketData.bondType
        ).teller;
        return (
          <div>
            {!allowanceIsLoading &&
              <div>
                <div className="text-center pb-8 leading-normal text-red-500">
                  Allowance: {allowance} {props.marketData.summaryData.payoutToken}
                </div>
                <div className="text-center pb-8 leading-normal">
                  In order to enable the market, you must allow the BondProtocol Teller contract ({teller}) to
                  spend {props.marketData.summaryData.payoutToken} from the market owner address ({data?.from}).
                </div>
                <div className="text-center pb-8 leading-normal">
                  Please ensure the allowance is sufficient for the expected bond size of your market.
                </div>
              </div>
            }
            {allowanceIsLoading &&
              <div className="text-center pb-8 leading-normal">
                Awaiting allowance tx...
              </div>
            }
            {allowanceForm()}
          </div>
        );
      default:
        return (
          <div>
            {!allowanceIsLoading &&
              <div>
                <div className="text-center pb-8 leading-normal text-green-500">
                  Allowance: {allowance} {props.marketData.summaryData.payoutToken}
                </div>
                <div className="text-center pb-8 leading-normal">
                  You have set an allowance for the BondProtocol Teller to
                  spend {props.marketData.summaryData.payoutToken} from the owner wallet.
                  <br/>
                  Please confirm the amount is sufficient for the expected bond size of your market, if not, you may update it
                  below.
                </div>
              </div>
            }
            {allowanceIsLoading &&
              <div className="text-center pb-8 leading-normal">
                Awaiting allowance tx...
              </div>
            }
            {allowanceForm()}
          </div>
        );
    }
  }

  const allowanceForm = () => {
    return (
      <div className="mx-[15vw]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("amount")}
            defaultValue={allowance > 0 ? allowance : 1000000000}
            label={`Allowance in ${props.marketData.summaryData.payoutToken}`}
            className="mb-2"
          />

          <Button type="submit" className="w-full font-fraktion mt-5">
            UPDATE ALLOWANCE
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      {isLoading &&
        <div className="text-xl text-center py-4 leading-normal">
          Waiting for tx confirmation...
        </div>
      }
      {!isLoading && data && !(data.status === 0) &&
        <div>
          <h1 className="text-5xl text-center font-faketion py-10 leading-normal">
            ALL SET!
            <br/>
            YOUR BOND MARKET
            <br/>
            HAS BEEN DEPLOYED
          </h1>

          {data?.from && protocol ?
            (
              <div>
                <h2 className="text-xl text-center py-4 leading-normal">
                  Owner verified as {protocol.name}!
                </h2>

                <p className="text-center py-8 leading-normal">
                  ({data?.from})
                </p>

                <p className="text-center py-8 leading-normal">
                  Your market is live on the contract, it should appear in our market list as soon as it has been
                  indexed by our subgraph.
                </p>

                <div className="pb-8">
                  {displayAllowance()}
                </div>

                <Button className="w-full font-fraktion mt-5"
                        onClick={
                          () => navigate("/issuers/" + protocol.name)
                        }>
                  {`Go to ${protocol.name} page`}
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

                {displayAllowance()}
              </div>
            )
          }
        </div>
      }
      {data && data.status === 0 &&
        <div className="text-center py-8 leading-normal">
          Error!
        </div>
      }
      <Button className="w-full font-fraktion mt-5"
              onClick={
                () => window.open(blockExplorerUrl + "/" + hash, "_blank", "noreferrer")
              }>
        {`View tx on ${blockExplorerName}`}
      </Button>
    </div>
  );
};
