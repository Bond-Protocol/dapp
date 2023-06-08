import { Button, Column, formatDate, PaginatedTable } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { OwnerBalance } from "../../generated/graphql";
import { ContractTransaction } from "ethers";
import { BOND_TYPE, redeem } from "@bond-protocol/contract-library";
import { toTableData } from "src/utils/table";

export const tableColumns: Array<Column<any>> = [
  {
    label: "Bond",
    accessor: "bond",
    unsortable: true,
    formatter: (ownerBalance) => {
      const balance = longFormatter.format(ownerBalance?.balance);
      return {
        value: `${balance} ${
          ownerBalance?.bond?.bondToken?.underlying?.symbol ?? "???"
        }`,
        icon: ownerBalance?.bond?.bondToken?.underlying?.logoURI,
      };
    },
  },
  {
    label: "Market Value",
    accessor: "value",
    formatter: (ownerBalance) => {
      return {
        value:
          ownerBalance?.usdPriceString !== ""
            ? usdFormatter.format(ownerBalance?.usdPriceString)
            : "Unknown",
      };
    },
  },
  {
    label: "Vesting",
    accessor: "vesting",
    defaultSortOrder: "asc",
    formatter: (ownerBalance) => {
      const expiry = ownerBalance?.bond?.bondToken?.expiry;
      const date = new Date(expiry * 1000);
      const formatted = formatDate.short(date);
      const timeLeft = formatDate.distanceToNow(date);

      return {
        value: ownerBalance.canClaim ? "Vested" : formatted,
        subtext: ownerBalance.canClaim ? `On ${formatted}` : `In ${timeLeft}`,
        sortValue: expiry,
      };
    },
  },
  {
    label: "",
    accessor: "claim",
    alignEnd: true,
    unsortable: true,
    formatter: (ownerBalance) => {
      return {
        onClick: () => ownerBalance.handleClaim(),
        data: ownerBalance,
      };
    },
    Component: (props: any) => {
      const { chain } = useNetwork();
      const { switchNetwork } = useSwitchNetwork();
      const { data: signer } = useSigner();

      const isCorrectNetwork = Number(props?.data?.bond.chainId) === chain?.id;

      const switchChain = () => {
        switchNetwork?.(Number(props?.data?.bondToken.chainId));
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

export const BondList = ({ data = [], ...props }: any) => {
  const tableData = data.map((b: any) => toTableData(tableColumns, b));

  return (
    <div className="mt-10">
      <PaginatedTable
        title={<div />}
        defaultSort="vesting"
        columns={tableColumns}
        data={tableData}
        Fallback={props.Fallback}
      />
    </div>
  );
};
