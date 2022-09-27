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

  const {data, isError, isLoading} = useWaitForTransaction(
    {
      chainId: props.marketData.chainId,
      hash: hash,
    });

  const {blockExplorerUrl: blockExplorerUrl, blockExplorerName: blockExplorerName} = getBlockExplorer(
    props.marketData.chain,
    "tx"
  );

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [allowance, setAllowance] = useState(-1);

  const onSubmit = (data: any) => {
    const auctioneer = contractLibrary.getAddressesForType(
      props.marketData.chain,
      props.marketData.bondType
    ).auctioneer;

    const tx = contractLibrary.changeApproval(
      props.marketData.marketParams.payoutToken,
      auctioneer,
      data.amount,
      // @ts-ignore
      signer
    );
  }

  useEffect(() => {
    if (data && !isError && !isLoading) {
      setProtocol(getProtocolByAddress(data.from, props.marketData.chain));
      const auctioneer = contractLibrary.getAddressesForType(
        props.marketData.chain,
        props.marketData.bondType
      ).auctioneer;

      getAllowance(
        props.marketData.marketParams.payoutToken,
        data.from,
        auctioneer,
        props.marketData.chain
      ).then((result) => {
        setAllowance(Number(result));
      })
    }
  }, [data, isError, isLoading]);

  const displayAllowance = () => {
    switch (allowance) {
      case -1:
        return;
      case 0:
        return (
          <div>
            {allowanceForm()}
          </div>
        );
      default:
        return (
          <div>
            <div className="text-center py-8 leading-normal">
              Allowance: {allowance} {props.marketData.summaryData.payoutToken}
            </div>
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
            label="Allowance"
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
      {!isLoading && !isError &&
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
      <Button className="w-full font-fraktion mt-5"
              onClick={
                () => window.open(blockExplorerUrl + "/" + hash, "_blank", "noreferrer")
              }>
        {`View tx on ${blockExplorerName}`}
      </Button>
      {isError &&
        <div className="text-center py-8 leading-normal">
          Error!
        </div>
      }
    </div>
  );
};
