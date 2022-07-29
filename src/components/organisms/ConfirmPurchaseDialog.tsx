import * as React from "react";
import {useEffect, useRef, useState} from "react";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Button from "components/atoms/Button";
import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";
import {BigNumberish, ContractTransaction} from "ethers";
import {useAccount, useSigner} from "wagmi";
import {useTokens} from "hooks";

export type ConfirmPurchaseDialogProps = {
  amount: string
  market: CalculatedMarket
}

export default function ConfirmPurchaseDialog(props: ConfirmPurchaseDialogProps) {
  const {data: signer} = useSigner();
  const {address} = useAccount();
  const currentPrices = useTokens().currentPrices;

  const [open, setOpen] = React.useState(false);
  const [payout, setPayout] = useState<string>("0");
  const [market, setMarket] = useState<CalculatedMarket>(props.market);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [transactionReceipt, setTransactionReceipt] = useState<any>(null);
  const [blockExplorerUrl, setBlockExplorerUrl] = useState(bondLibrary.CHAINS.get(market.network)?.blockExplorerUrls[0].replace("#", "tx"));
  const [blockExplorerName, setBlockExplorerName] = useState(bondLibrary.CHAINS.get(market.network)?.blockExplorerName);

  const timerRef = useRef<NodeJS.Timeout>();

  const twitterLink =
    "https://twitter.com/intent/tweet?text=I just received a " +
    props.market.discount +
    "%25 discount on $" +
    props.market.payoutToken.symbol +
    " thanks to @Bond_Protocol bonds. Don't miss out on yours! " +
    //  (bond.socials.twitter ? bond.socials.twitter + `,` : "") +
    " %0A%0Abondprotocol.finance";

  const handleOpen = () => {
    setTransactionStatus("");
    setSlippage(0.5);
    setPayout("0");
    setOpen(true);

    timerRef.current = setInterval(() => {
      void getPayoutFor();
      void refreshMarket();
    }, 5 * 1000);

    void getPayoutFor();
    void refreshMarket();
  };

  const handleClose = () => {
    clearInterval(timerRef.current);
    setOpen(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, [timerRef]);

  function getPrice(id: string): string {
    const sources = currentPrices.get(id);
    if (!sources) return "";
    for (const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return source.price;
    }
    return "";
  }

  async function bond() {
    const minimumOut = Number(payout) - (Number(payout) * (slippage / 100));

    const bondTx: ContractTransaction = await contractLibrary.purchase(
      // @ts-ignore
      address,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
      props.market.marketId,
      Number(props.amount).toFixed(18),
      minimumOut.toFixed(18),
      props.market.teller,
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );

    setTransactionStatus("awaiting");
    clearInterval(timerRef.current);

    await signer?.provider?.waitForTransaction(bondTx.hash)
      .then((result) => {
        result.status === 0 ? setTransactionStatus("reverted") : setTransactionStatus("success");
        setTransactionReceipt(result);
      })
      .catch((error) => console.log(error));
  }

  async function refreshMarket() {
    void await contractLibrary.calcMarket(
      // @ts-ignore
      signer?.provider,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
      {
        id: market.id,
        network: market.network,
        auctioneer: market.auctioneer,
        teller: market.teller,
        vesting: market.vesting,
        vestingType: market.vestingType,
        payoutToken: {
          id: market.payoutToken.id,
          address: market.payoutToken.address,
          decimals: market.payoutToken.decimals,
          name: market.payoutToken.name,
          symbol: market.payoutToken.symbol,
          price: getPrice(market.payoutToken.id),
        },
        quoteToken: {
          id: market.quoteToken.id,
          address: market.quoteToken.address,
          decimals: market.quoteToken.decimals,
          name: market.quoteToken.name,
          symbol: market.quoteToken.symbol,
          price: getPrice(market.payoutToken.id),
        }
      }
    ).then((result: CalculatedMarket) => {
      setMarket(result);
    });
  }

  async function getPayoutFor() {
    const payout: BigNumberish = await contractLibrary.payoutFor(
      // @ts-ignore
      signer?.provider,
      props.amount,
      props.market.marketId,
      props.market.auctioneer,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS
    );
    setPayout((Number(payout) / Math.pow(10, 18)).toString());
  }

  return (
    <div className="w-full">
      <Button disabled={(Number(props.amount) <= 0)} className="w-full" onClick={handleOpen}>
        Bond
      </Button>
      <ModalUnstyled
        aria-labelledby="title"
        open={open}
        onClose={handleClose}
      >
        <div
          className="bg-brand-covenant w-[35rem] h-[35rem] text-brand-texas-rose fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <Button onClick={handleClose}>X</Button>
          {
            transactionStatus === "" &&
            (
              <>
                <h1 id="title">Confirm Transaction</h1>
                <div>
                  Slippage
                  <Button onClick={() => setSlippage(0)}>0%</Button>
                  <Button onClick={() => setSlippage(0.5)}>0.5%</Button>
                  <Button onClick={() => setSlippage(1)}>1%</Button>
                  <Button onClick={() => setSlippage(2)}>2%</Button>
                </div>
                <p>You will spend: {props.amount} {props.market.quoteToken.symbol}</p>
                <p>You will get a maximum of: {payout} {props.market.payoutToken.symbol}</p>
                <p>You will get a minimum
                  of: {Number(payout) - (Number(payout) * (slippage / 100))} {props.market.payoutToken.symbol} ({slippage}%
                  Slippage)</p>
                <p>Bond
                  Price: {props.market.formattedDiscountedPrice} per {props.market.payoutToken.symbol} (Market: {props.market.formattedFullPrice})</p>
                <p>Discount: {market.discount}%</p>
                <Button className="w-full" onClick={bond}>Bond</Button>
              </>
            )
          }
          {
            transactionStatus === "awaiting" &&
            (
              <>
                <h1 id="title">Transaction Submitted</h1>
                <p>Awaiting confirmation...</p>
              </>
            )
          }
          {
            transactionStatus === "success" &&
            (
              <>
                <h1 id="title">Bond Purchased!</h1>
                <p>You will
                  receive {parseInt(transactionReceipt.logs[1].data) / Math.pow(10, market.payoutToken.decimals)} {market.payoutToken.symbol}</p>
                <div>
                  <a target="_blank" href={twitterLink} rel="noreferrer">Share on Twitter</a>
                </div>
                <p>View on <a href={blockExplorerUrl + transactionReceipt.transactionHash} target="_blank"
                  rel="noopener noreferrer">
                  {blockExplorerName}
                </a>
                </p>
                <Button className="w-full" onClick={handleClose}>Close</Button>
              </>
            )
          }
          {
            transactionStatus === "reverted" &&
            (
              <>
                <h1 id="title">Transaction Reverted</h1>
                <p>You fucked up bruv</p>
                <Button className="w-full" onClick={handleClose}>Close</Button>
              </>
            )
          }
        </div>
      </ModalUnstyled>
    </div>
  );
}
