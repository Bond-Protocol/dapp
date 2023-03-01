import { useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { calculateTrimDigits, trim } from "@bond-protocol/contract-library";
import { TokenDetails, InfoLabel } from "ui";
import { useMyBonds } from "hooks/useMyBonds";
import { useTokens } from "hooks";
import { OwnerBalance } from "src/generated/graphql";
import { PageHeader } from "components/common";
import { BondList, tableColumns } from "components/lists";
import { toTableData } from "src/utils/table";
import { usdFormatter } from "src/utils/format";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { LoadingIndicator } from "components/utility/LoadingIndicator";

export const Dashboard = () => {
  const { myBonds, isLoading } = useMyBonds();
  const { chain } = useNetwork();
  const {
    getTokenDetails,
    getPrice,
    isLoading: arePricesLoading,
    currentPrices,
  } = useTokens();
  const account = useAccount();

  const data = useMemo(() => {
    return myBonds
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

        const usdPriceNumber: number =
          Number(getPrice(bond.bondToken.underlying.id)) * Number(balance);
        const usdPriceString: string = trim(
          usdPriceNumber,
          calculateTrimDigits(usdPriceNumber)
        );

        const underlying: TokenDetails =
          bond.bondToken && getTokenDetails(bond.bondToken.underlying);

        const isCorrectNetwork = Number(bond.bondToken.chainId) === chain?.id;

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
  }, [currentPrices, myBonds]);

  const tableData = useMemo(
    () => data?.map((b) => toTableData(tableColumns, b)),
    [data]
  );

  const tbv =
    data?.reduce((total, bond) => {
      //@ts-ignore
      return total + bond.usdPriceNumber;
    }, 0) || 0;

  const claimable = data.reduce((total, bond) => {
    if (!bond?.canClaim) return total;

    const price = bond?.usdPriceString || "0";
    return total + parseFloat(price);
  }, 0);

  const loading = isLoading || arePricesLoading;
  const formattedTbv = usdFormatter.format(tbv as number);
  const formattedClaimable = usdFormatter.format(claimable);

  return (
    <>
      <PageHeader title={"Dashboard"} />
      <RequiresWallet>
        <LoadingIndicator loading={loading}>
          <div className="mt-10 flex gap-4">
            <InfoLabel
              label="Account TBV"
              tooltip="Total amount bonded in by this address denominated in USD"
            >
              {formattedTbv}
            </InfoLabel>
            <InfoLabel
              label="Claimable"
              tooltip="Total claimable value denominated in USD"
            >
              <div className="text-light-success">{formattedClaimable}</div>
            </InfoLabel>
          </div>
          <div className="mt-10">
            <BondList data={account?.address && tableData} />
          </div>
        </LoadingIndicator>
      </RequiresWallet>
    </>
  );
};
