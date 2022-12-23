import { useAccount, useNetwork } from "wagmi";
import { useMyBonds } from "hooks/useMyBonds";
import { InfoLabel } from "ui";
import { OwnerBalance } from "src/generated/graphql";
import { TokenDetails, useTokens } from "hooks";
import {
  calculateTrimDigits,
  trim,
} from "@bond-protocol/contract-library";
import { PageHeader } from "components/common";
import { BondList, tableColumns } from "components/lists";
import { toTableData } from "src/utils/table";
import { usdFormatter } from "src/utils/format";
import { RequiresWallet } from "components/utility/RequiresWallet";
import {useMemo} from "react";

const isMainnet = (chain?: string) => {
  return chain === "mainnet" || chain === "homestead";
};

export const Dashboard = () => {
  const { myBonds } = useMyBonds();
  const { chain } = useNetwork();
  const { getTokenDetails, getPrice, currentPrices } = useTokens();
  const account = useAccount();

  const data = useMemo(() => {return myBonds
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

        const usdPriceNumber: number = Number(getPrice(bond.bondToken.underlying.id)) * Number(balance);
        const usdPriceString: string = trim(usdPriceNumber, calculateTrimDigits(usdPriceNumber));

        const underlying: TokenDetails =
          bond.bondToken && getTokenDetails(bond.bondToken.underlying);

        const network =
          bond.bondToken.network === "arbitrum-one"
            ? "arbitrum"
            : bond.bondToken.network;

        const isCorrectNetwork =
          (isMainnet(bond.bondToken.network) && isMainnet(chain?.network)) ||
          network === chain?.network;

        return {
          bond,
          balance,
          usdPriceString,
          usdPriceNumber,
          underlying,
          isCorrectNetwork,
          canClaim,
        };
      });
  }, [currentPrices]);

  const tableData = useMemo(() => data?.map((b) => toTableData(tableColumns, b)), [data]);

  const tbv = usdFormatter.format(
    data?.reduce((total, bond) => {
      //@ts-ignore
      return total + bond.usdPriceNumber;
    }, 0) as number
  );

  const claimable = usdFormatter.format(
    data.reduce((total, bond) => {
      if (!bond?.canClaim) return total;

      const price = bond?.usdPriceString || "0";
      return total + parseFloat(price);
    }, 0)
  );

  return (
    <>
      <PageHeader title={"Dashboard"} />
      <RequiresWallet>
        <div className="mt-10 flex gap-4">
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
