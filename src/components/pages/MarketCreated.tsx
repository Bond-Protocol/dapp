import { useSigner, useWaitForTransaction } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { getBlockExplorer } from "../../utils";
import { getProtocolByAddress, Protocol } from "@bond-protocol/bond-library";
import Button from "../atoms/Button";
import * as React from "react";
import { useEffect, useState } from "react";
import { usePurchaseBond } from "hooks";
import * as contractLibrary from "@bond-protocol/contract-library";
import { Input } from "components";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import copyIcon from "assets/icons/copy-icon.svg";

export type MarketCreatedParams = {
  marketData: any;
};

export const MarketCreated = (props: MarketCreatedParams) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const { getAllowance } = usePurchaseBond();
  const { register, handleSubmit } = useForm();
  const { data: signer } = useSigner();

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [allowance, setAllowance] = useState(-1);
  const [allowanceTx, setAllowanceTx] = useState("");
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(
    props.marketData.formValues.marketOwnerAddress
  );

  const { data, isLoading } = useWaitForTransaction({
    chainId: props.marketData.chainId,
    hash: hash,
  });

  const teller = contractLibrary.getAddressesForType(
    props.marketData.chain,
    props.marketData.bondType
  ).teller;

  const { isLoading: allowanceIsLoading } = useWaitForTransaction({
    chainId: props.marketData.chainId,
    hash: allowanceTx,
    onSuccess() {
      loadAllowance();
    },
  });

  const {
    blockExplorerUrl: blockExplorerUrl,
    blockExplorerName: blockExplorerName,
  } = getBlockExplorer(props.marketData.chain, "tx");

  const loadAllowance = () => {
    const auctioneer = contractLibrary.getAddressesForType(
      props.marketData.chain,
      props.marketData.bondType
    ).auctioneer;

    getAllowance(
      props.marketData.marketParams.payoutToken,
      ownerAddress,
      auctioneer,
      props.marketData.chain,
      props.marketData.payoutToken.decimals
    ).then((result) => {
      setAllowance(Number(result));
      setIsAllowanceSufficient(
        Number(props.marketData.formValues.marketCapacity) <= Number(result)
      );
    });
  };

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
  };

  useEffect(() => {
    if (data && !(data.status === 0) && !isLoading) {
      setProtocol(getProtocolByAddress(ownerAddress, props.marketData.chain));
      setOwnerAddress(props.marketData.isMultisig ? data.to : data.from);
      loadAllowance();
    }
  }, [data, isLoading, allowanceTx]);

  const displayAllowance = () => {
    switch (allowance) {
      case -1:
        return;
      case 0:
        return (
          <div>
            {!allowanceIsLoading && (
              <div>
                <div className="text-center pb-8 leading-normal text-red-500">
                  Allowance: {allowance}{" "}
                  {props.marketData.summaryData.payoutToken}
                  <br />
                  Capacity: {props.marketData.formValues.marketCapacity}{" "}
                  {props.marketData.summaryData.payoutToken}
                </div>
                <div className="text-center pb-8 leading-normal">
                  In order to enable the market, you must allow the BondProtocol
                  Teller contract ({teller}) to spend{" "}
                  {props.marketData.summaryData.payoutToken} from the market
                  owner address ({ownerAddress}).
                </div>
              </div>
            )}
            {allowanceIsLoading && (
              <div className="text-center pb-8 leading-normal">
                Awaiting allowance tx...
              </div>
            )}
            {allowanceForm()}
          </div>
        );
      default:
        return (
          <div>
            {!allowanceIsLoading && (
              <div>
                <div
                  className={`text-center pb-8 leading-normal ${
                    isAllowanceSufficient ? `text-green-500` : `text-red-500`
                  }`}
                >
                  Allowance: {allowance}{" "}
                  {props.marketData.summaryData.payoutToken}
                  <br />
                  Capacity: {props.marketData.formValues.marketCapacity}{" "}
                  {props.marketData.summaryData.payoutToken}
                </div>
                {isAllowanceSufficient && (
                  <div className="text-center pb-8 leading-normal">
                    <p className="pb-8">
                      You have set a sufficient allowance for the capacity of
                      your market.
                    </p>
                    <p className="pb-8">
                      If you have multiple markets paying out{" "}
                      {props.marketData.summaryData.payoutToken} from this
                      address, you should adjust the allowance to cover the sum
                      capacity of all markets.
                    </p>
                    {allowanceForm()}
                  </div>
                )}
                {allowance > 0 && !isAllowanceSufficient && (
                  <div className="text-center pb-8 leading-normal">
                    <p className="pb-8">
                      You have set an insufficient allowance for the capacity of
                      your market. We recommend setting the allowance high
                      enough to cover the full market capacity.
                    </p>
                    <p className="pb-8">
                      If you have multiple markets paying out{" "}
                      {props.marketData.summaryData.payoutToken} from this
                      address, you should adjust the allowance to cover the sum
                      capacity of all markets.
                    </p>
                    {allowanceForm()}
                  </div>
                )}
              </div>
            )}
            {allowanceIsLoading && (
              <div className="text-center pb-8 leading-normal">
                Awaiting allowance tx...
              </div>
            )}
          </div>
        );
    }
  };

  const allowanceForm = () => {
    return (
      <div className="w-full flex justify-center">
        {props.marketData.isMultisig === false && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("amount")}
              defaultValue={props.marketData.formValues.marketCapacity}
              label={`Allowance in ${props.marketData.summaryData.payoutToken}`}
              className="mb-2"
            />

            <Button type="submit" className="w-full font-faketion mt-5">
              UPDATE ALLOWANCE
            </Button>
          </form>
        )}
        {props.marketData.isMultisig === true && (
          <div>
            <div>
              Please execute the following transaction with your multisig to
              update the allowance:
            </div>

            <div className="py-8 flex justify-center">
              <table>
                <tr>
                  <td className="text-left pr-4">Contract Address</td>
                  <td className="text-xs pr-4">
                    {props.marketData.marketParams.payoutToken}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        navigator.clipboard.writeText(
                          props.marketData.marketParams.payoutToken
                        )
                      }
                      src={copyIcon}
                      className="stroke-current"
                      width={16}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-left pr-4">Method Name</td>
                  <td className="text-xs pr-4">approve</td>
                </tr>
                <tr>
                  <td className="text-left pr-4">_spender</td>
                  <td className="text-xs pr-4">{teller}</td>
                  <td>
                    <img
                      onClick={() => navigator.clipboard.writeText(teller)}
                      src={copyIcon}
                      className="stroke-current"
                      width={16}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-left pr-4">amount</td>
                  <td className="text-xs pr-4">
                    {ethers.utils
                      .parseUnits(
                        props.marketData.formValues.marketCapacity,
                        props.marketData.payoutToken.decimals
                      )
                      .toString()}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        navigator.clipboard.writeText(
                          ethers.utils
                            .parseUnits(
                              props.marketData.formValues.marketCapacity,
                              props.marketData.payoutToken.decimals
                            )
                            .toString()
                        )
                      }
                      src={copyIcon}
                      className="stroke-current"
                      width={16}
                    />
                  </td>
                </tr>
              </table>
            </div>

            <Button
              onClick={() => loadAllowance()}
              className="w-full font-faketion mt-5"
            >
              REFRESH ALLOWANCE
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-[20vw]">
      {isLoading && (
        <div className="text-xl text-center py-4 leading-normal">
          Waiting for tx confirmation...
        </div>
      )}
      {!isLoading && data && !(data.status === 0) && (
        <div>
          <h1 className="text-5xl text-center font-faketion py-10 leading-normal">
            ALL SET!
            <br />
            YOUR BOND MARKET
            <br />
            HAS BEEN DEPLOYED
          </h1>

          {ownerAddress && protocol ? (
            <div>
              <h2 className="text-xl text-center py-4 leading-normal text-green-500">
                Owner verified as {protocol.name}!
              </h2>

              <p className="text-center pb-4 leading-normal text-green-500">
                ({ownerAddress})
              </p>

              <p className="text-center py-8 leading-normal">
                Your market is live on the contract, it should appear in our
                market list as soon as it has been indexed by our subgraph.
              </p>

              <div className="pb-8">{displayAllowance()}</div>

              <Button
                className="w-full font-faketion mt-5"
                onClick={() => navigate("/issuers/" + protocol.name)}
              >
                {`Go to ${protocol.name} page`}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-center py-8 leading-normal">
                Your market is live on the contract, however we cannot find
                protocol details for the owner address {ownerAddress}.
              </p>

              <p className="text-center py-8 leading-normal">
                In order for BondProtocol to display your market on our site,
                you must verify your protocol details with us. If you have not
                done so already, click below to start the process.
              </p>

              <p className="text-center py-8 leading-normal">
                If this is not done, the market will still be live, but users
                will need to access it directly via the contract, or via your
                own UI.
              </p>

              {displayAllowance()}
            </div>
          )}
        </div>
      )}
      {data && data.status === 0 && (
        <div className="text-center py-8 leading-normal">Error!</div>
      )}
      <Button
        className="w-full font-faketion mt-5"
        onClick={() =>
          window.open(blockExplorerUrl + "/" + hash, "_blank", "noreferrer")
        }
      >
        {`View tx on ${blockExplorerName}`}
      </Button>
    </div>
  );
};
