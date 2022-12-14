import { ContractTransaction } from "ethers";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { useMyBonds } from "hooks/useMyBonds";
import { Button, InfoLabel, Loading } from "ui";
import {
  OwnerBalance,
  useListBondPurchasesByAddressQuery,
} from "src/generated/graphql";
import { providers } from "services/owned-providers";
import { TokenDetails, useTokens } from "hooks";
import { useNavigate } from "react-router-dom";
import {
  calculateTrimDigits,
  trim,
  BOND_TYPE,
  redeem,
} from "@bond-protocol/contract-library";
import { PageHeader } from "components/common";
import { BondList, tableColumns } from "components/lists";
import { toTableData } from "src/utils/table";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import { usdFormatter } from "src/utils/format";
import { RequiresWallet } from "components/utility/RequiresWallet";

const isMainnet = (chain?: string) => {
  return chain === "mainnet" || chain === "homestead";
};

const NoBondsView = ({ loading }: { loading: boolean }) => {
  const navigate = useNavigate();

  const goToMarkets = () => navigate("/markets");

  if (loading) {
    return <Loading content="your bonds" />;
  }

  return (
    <div className="mt-10 flex flex-col">
      <h1 className="font-faketion py-10 text-center text-5xl leading-normal">
        YOU DONT
        <br />
        HAVE A BOND YET
      </h1>
      <Button className="mx-auto" onClick={goToMarkets}>
        Explore the Market to bond
      </Button>
    </div>
  );
};

export const Dashboard = () => {
  const { myBonds, refetch } = useMyBonds();
  const { data: signer } = useSigner();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { getTokenDetails, getPrice } = useTokens();
  const account = useAccount();
  const endpoint = subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET];

  const purchases = useListBondPurchasesByAddressQuery(
    { endpoint },
    { recipient: account.address?.toLowerCase() }
  );

  const switchChain = (e: Event, selectedChain: string) => {
    e.preventDefault();
    const newChain = Number(
      "0x" + providers[selectedChain].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  async function redeemBond(bond: Partial<OwnerBalance>) {
    if (!bond.bondToken) return;
    const redeemTx: ContractTransaction = await redeem(
      bond.bondToken.id,
      bond.bondToken.network,
      bond.bondToken.type as BOND_TYPE,
      bond.balance.toString(),
      // @ts-ignore
      signer,
      bond.bondToken.teller,
      {}
    );

    await signer?.provider
      ?.waitForTransaction(redeemTx.hash)
      .catch((error) => console.log(error));
  }

  const data = myBonds
    .filter((b) => b.owner?.toLowerCase() === account?.address?.toLowerCase())
    .map((bond: Partial<OwnerBalance>) => {
      if (!bond.bondToken || !bond.bondToken.underlying) return;

      const date = new Date(bond.bondToken.expiry * 1000);
      const now = new Date(Date.now());
      const canClaim = now >= date;

      //const purchase = purchases?.data?.bondPurchases.find();

      let balance: number | string =
        bond.balance / Math.pow(10, bond.bondToken.underlying.decimals);
      balance = trim(balance, calculateTrimDigits(balance));

      let usdPrice: number | string =
        Number(getPrice(bond.bondToken.underlying.id)) * Number(balance);
      usdPrice = trim(usdPrice, calculateTrimDigits(usdPrice));

      const underlying: TokenDetails =
        bond.bondToken && getTokenDetails(bond.bondToken.underlying);

      const isCorrectNetwork =
        (isMainnet(bond.bondToken.network) && isMainnet(chain?.network)) ||
        bond.bondToken.network === chain?.network;

      const handleClaim = isCorrectNetwork
        ? () => redeemBond(bond)
        : (e: React.BaseSyntheticEvent) =>
            // @ts-ignore
            switchChain(e, bond.bondToken.network);

      return {
        bond,
        balance,
        usdPrice,
        underlying,
        isCorrectNetwork,
        canClaim,
        handleClaim,
      };
    });

  const tableData = data?.map((b) => toTableData(tableColumns, b));

  const tbv = usdFormatter.format(
    purchases?.data?.bondPurchases?.reduce((total, bond) => {
      return total + bond.payout * bond.purchasePrice;
    }, 0) as number
  );

  const claimable = usdFormatter.format(
    data.reduce((total, bond) => {
      if (!bond?.canClaim) return total;

      const price = bond?.usdPrice || "0";
      return total + parseFloat(price);
    }, 0)
  );

  return (
    <>
      <PageHeader title={"Dashboard"} />
      <RequiresWallet>
        <div className="mt-10 flex gap-6">
          <InfoLabel
            label="Account TBV"
            tooltip="Total amount bonded in by this address denominated in USD"
          >
            {tbv}
          </InfoLabel>
          <InfoLabel
            label="Claimable"
            tooltip="Total claimable value denominated in USD"
          >
            <div className="text-light-success">{claimable}</div>
          </InfoLabel>
        </div>
        <div className="mt-10">
          <BondList data={account?.address && tableData} />
        </div>
      </RequiresWallet>
    </>
  );
};
