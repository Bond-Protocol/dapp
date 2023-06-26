import { Button, Column, formatDate, PaginatedTable } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { OwnerBalance } from "../../generated/graphql";
import { BOND_TYPE, redeem } from "@bond-protocol/contract-library";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TransactionWizard } from "components/modals/TransactionWizard";

export const tableColumns: Array<Column<any>> = [
  {
    label: "Bond",
    accessor: "bond",
    unsortable: true,
    formatter: (ownerBalance) => {
      const balance = longFormatter.format(ownerBalance?.balance);
      return {
        value: `${balance} ${ownerBalance?.underlying?.symbol ?? "???"}`,
        icon: ownerBalance?.underlying?.logoURI,
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
      const [open, setOpen] = useState(false);
      const { chain } = useNetwork();
      const { switchNetwork } = useSwitchNetwork();
      const { data: signer } = useSigner();
      const [tx, setTx] = useState<any>();

      const isCorrectNetwork =
        Number(props?.data?.bond?.bondToken?.chainId) === chain?.id;

      const switchChain = () => {
        switchNetwork?.(Number(props?.data?.bond?.bondToken?.chainId));
      };

      async function redeemBond(bond: Partial<OwnerBalance>) {
        if (!bond.bondToken || !signer) return;
        return redeem(
          bond.bondToken.id,
          bond.bondToken.type as BOND_TYPE,
          bond.balance.toString(),
          signer,
          bond.bondToken.teller,
          {}
        );
      }

      const claim = () => {
        setOpen(true);
        const tx = redeemBond(props?.data?.bond);
        setTx(tx);
      };

      const handleClaim = isCorrectNetwork
        ? () => claim()
        : () => switchChain();

      return (
        <>
          <Button
            thin
            variant="primary"
            disabled={!props?.data?.canClaim}
            className={`mr-4 w-24 ${!props.data?.canClaim && "opacity-60"}`}
            onClick={() => handleClaim()}
          >
            Claim
          </Button>
          <TransactionWizard
            open={open}
            onSubmit={() => redeemBond(props?.data?.bond)}
            onClose={() => setOpen(false)}
            SuccessDialog={() => <div>Bond claimed!</div>}
            signingTx={tx}
          />
        </>
      );
    },
  },
];

export const BondList = ({ data = [], ...props }: any) => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <PaginatedTable
        title={props.title ?? <div />}
        defaultSort="vesting"
        columns={tableColumns}
        data={data}
        loading={props.isLoading}
        fallback={{
          title: "YOU HAVE NO PENDING BONDS",
          onClick: () => navigate("/markets"),
          buttonText: "Explore Bond Markets",
        }}
      />
    </div>
  );
};
