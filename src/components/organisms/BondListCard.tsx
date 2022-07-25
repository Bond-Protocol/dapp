import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";
import {Chip, Input} from "@material-tailwind/react";
import {DataRow} from "components/atoms/DataRow";
import {BaseSyntheticEvent, FC, useEffect, useState} from "react";
import {Button} from "..";
import {useAccount, useBalance, useConnect, useProvider, useSigner, useSwitchNetwork} from "wagmi";
import {providers} from "services/owned-providers";
import {BigNumberish, ContractTransaction} from "ethers";
import {InjectedConnector} from "wagmi/connectors/injected";
import ConfirmPurchaseDialog from "./ConfirmPurchaseDialog";

export type BondListCardProps = {
  market: CalculatedMarket
};

export const BondListCard: FC<BondListCardProps> = (props) => {
  const provider = useProvider();
  const {data: signer} = useSigner();
  const {address, isConnected} = useAccount();
  const {connect} = useConnect({connector: new InjectedConnector()});
  const {switchNetwork} = useSwitchNetwork();

  const {data} = useBalance({
    token: props.market.quoteToken.address,
    addressOrName: address,
    chainId: providers[props.market.network].network.chainId,
  });

  const protocol = bondLibrary.getProtocolByAddress(
    props.market.payoutToken.address,
    providers[props.market.network].network.chainId.toString()
  );

  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [payout, setPayout] = useState<string>("0");
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const [correctChain, setCorrectChain] = useState<boolean>(false);

  useEffect(() => {
    setHasSufficientAllowance(Number(allowance) > 0 && Number(allowance) >= Number(amount));
  }, [allowance, amount]);

  useEffect(() => {
    void getPayoutFor(amount);
  }, [amount]);

  useEffect(() => {
    const balance: string = data?.formatted || "0";
    setBalance(balance);
  }, [data]);

  useEffect(() => {
    void getAllowance();
    void checkChain();
  }, [isConnected, signer]);

  function setMax() {
    const max = Math.min(Number(balance), props.market.maxAmountAccepted);
    setAmount(max.toString());
  }

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number("0x" + providers[props.market.network].network.chainId.toString());
    switchNetwork?.(newChain);
  };

  async function checkChain() {
    const network = await signer?.provider?.getNetwork();
    setCorrectChain((network && network.name === props.market.network) || false);
  }

  async function getAllowance() {
    if (!address) return 0;
    const requestProvider = providers[props.market.network] || provider;

    let allowance: BigNumberish = await contractLibrary.getAllowance(
      props.market.quoteToken.address,
      address,
      props.market.auctioneer,
      requestProvider
    );
    allowance = Number(allowance) / Math.pow(10, 18);
    setAllowance(allowance.toString());
  }

  async function approve() {
    if (!address || !signer) connect();
    const approval: ContractTransaction = await contractLibrary.changeApproval(
      props.market.quoteToken.address,
      props.market.auctioneer,
      "1000000000",
      // @ts-ignore
      signer
    );

    await signer?.provider?.waitForTransaction(approval.hash)
      .then(() => void getAllowance());
  }

  async function getPayoutFor(amount: string) {
    if (!amount) {
      setPayout("0");
      return;
    }

    const requestProvider = providers[props.market.network] || provider;

    const payout: BigNumberish = await contractLibrary.payoutFor(
      requestProvider,
      amount,
      props.market.marketId,
      props.market.auctioneer,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS
    );
    setPayout((Number(payout) / Math.pow(10, 18)).toString());
  }

  return (
    <div className="px-2 pb-2 w-[90vw]">
      <div className="my-4 flex justify-between">
        <div>
          <span>{props.icon}</span>
          <span className="mx-2 text-4xl">
            {protocol && protocol.name}
          </span>
          <p>{protocol && protocol.description}</p>
        </div>
        {/*TODO: insert graph and decide on what data we need*/}
        <div className="border-2">GRAPH GOES HERE</div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          {isConnected ?
            (<p>Balance: {balance + " " + props.market.quoteToken.symbol}</p>) :
            (<p>Balance: <Button onClick={connect}>Connect Wallet!</Button></p>)
          }
          <div>
            <Chip value="25%" className="mr-2"/>
            <Chip value="50%" className="mr-2"/>
            <Chip value="75%" className="mr-2"/>
            <Chip value="MAX" className="mr-2" onClick={setMax}/>
          </div>
        </div>
        <div className="flex">
          <Input
            value={amount}
            placeholder="Enter an amount to bond"
            onChange={(event: BaseSyntheticEvent) => {
              setAmount(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="pt-2">
        <DataRow leftContent="You Will Get" rightContent={
          payout + " " + props.market.payoutToken.symbol
        }/>

        <DataRow leftContent="Max Accepted" rightContent={
          props.market.maxAmountAccepted + " " + props.market.quoteToken.symbol
        }/>

        <DataRow
          leftContent="Bond Contract"
          rightContent={"View"}
          onClick={() =>
            window.location.replace(
              //TODO: dynamically link the blockexplorer based on network
              `https://etherscan.io/${props.bondContract}`
            )
          }
        />
      </div>

      <div className="flex pt-2">
        {/*TODO: add proper handlers*/}
        {!isConnected &&
            <Button className="w-full" onClick={connect}>
                Connect Wallet
            </Button>
        }

        {isConnected && !correctChain &&
            <Button className="w-full" onClick={switchChain}>
                Switch to {props.market.network}
            </Button>
        }

        {correctChain && !hasSufficientAllowance &&
            <Button className="w-full" onClick={approve}>
                Approve {props.market.quoteToken.symbol}
            </Button>
        }

        {correctChain && hasSufficientAllowance &&
            <ConfirmPurchaseDialog amount={amount} market={props.market} />
        }
      </div>
    </div>
  );
};
