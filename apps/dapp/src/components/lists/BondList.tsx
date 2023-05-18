import { getToken } from "@bond-protocol/bond-library";
import { Button, PaginatedTable, Column, formatDate } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { OwnerBalance } from "../../generated/graphql";
import { ContractTransaction } from "ethers";
import { BOND_TYPE, redeem } from "@bond-protocol/contract-library";
import { useMemo } from "react";

export const tableColumns: Array<Column<any>> = [
  {
    label: "Bond",
    accessor: "asset",
    unsortable: true,
    formatter: (bond) => {
      const asset = getToken(bond?.underlying?.id);
      const balance = longFormatter.format(bond?.balance);
      return {
        value: `${balance} ${asset?.symbol}`,
        icon: asset?.logoUrl,
      };
    },
  },
  {
    label: "Market Value",
    accessor: "price",
    formatter: (bond) => {
      return {
        value: usdFormatter.format(bond?.usdPriceString),
      };
    },
  },
  {
    label: "Vesting",
    accessor: "vesting",
    defaultSortOrder: "asc",
    formatter: (bond) => {
      const expiry = bond?.bond?.bondToken?.expiry;
      const date = new Date(expiry * 1000);
      const formatted = formatDate.short(date);
      const timeLeft = formatDate.distanceToNow(date);

      return {
        value: bond.canClaim ? "Vested" : formatted,
        subtext: bond.canClaim ? `On ${formatted}` : `In ${timeLeft}`,
        sortValue: expiry,
      };
    },
  },
  {
    label: "",
    accessor: "claim",
    alignEnd: true,
    unsortable: true,
    formatter: (bond) => {
      return {
        onClick: () => bond.handleClaim(),
        data: bond,
      };
    },
    Component: (props: any) => {
      const { chain } = useNetwork();
      const { switchNetwork } = useSwitchNetwork();
      const { data: signer } = useSigner();

      const isCorrectNetwork =
        Number(props?.data?.bond.bondToken.chainId) === chain?.id;

      const switchChain = () => {
        switchNetwork?.(Number(props?.data?.bond.bondToken.chainId));
      };

      async function redeemBond(bond: Partial<OwnerBalance>) {
        if (!bond.bondToken) return;
        const redeemTx: ContractTransaction = await redeem(
          bond.bondToken.id,
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

      const handleClaim = isCorrectNetwork
        ? () => redeemBond(props?.data?.bond)
        : () => switchChain();

      return (
        <Button
          thin
          size="sm"
          variant={props?.data?.canClaim ? "primary" : "ghost"}
          disabled={!props?.data?.canClaim}
          className={`mr-4 w-24 ${!props.data?.canClaim && "opacity-60"}`}
          onClick={() => handleClaim()}
        >
          {props?.data?.canClaim ? "Claim" : "Vesting"}
        </Button>
      );
    },
  },
];

export const BondList = (props: any) => {
  const tableData = useMemo(() => props.data, [props.data[0]?.price]);

  return (
    <div>
      <PaginatedTable
        defaultSort="vesting"
        columns={tableColumns}
        data={tableData}
        Fallback={props.Fallback}
      />
    </div>
  );
};
