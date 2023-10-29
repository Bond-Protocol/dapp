import { Button, Column, formatDate, PaginatedTable } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { OwnerBalance } from "../../generated/graphql";
import { BondType } from "@bond-protocol/contract-library";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useRedeemBond } from "hooks/contracts/useRedeem";

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
      const [tx, setTx] = useState<any>();

      const bond: OwnerBalance = props.data.bond;
      const redeem = useRedeemBond({
        bond,
        bondType: "" as BondType,
        marketId: 1,
        tellerAddress: "0x123",
      });

      const chainId = props?.data?.bond?.bondToken.chainId;

      const isCorrectNetwork =
        Number(props?.data?.bond?.bondToken?.chainId) === chain?.id;

      const switchChain = () => {
        switchNetwork?.(Number(props?.data?.bond?.bondToken?.chainId));
      };

      const claim = () => {
        setOpen(true);
        const tx = redeem.write();
        return "";
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
            chainId={chainId}
            open={open}
            //@ts-ignore
            onSubmit={() => claim()}
            onClose={() => setOpen(false)}
            SuccessDialog={() => <div>Bond claimed!</div>}
            signingTx={tx}
          />
        </>
      );
    },
  },
];

const mobileColumns = tableColumns.filter((c) => c.accessor !== "value");

export const BondList = ({ data = [], ...props }: any) => {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();

  return (
    <div className="mt-10">
      <PaginatedTable
        title={props.title ?? <div />}
        hideSearchbar={isTabletOrMobile}
        defaultSort="vesting"
        columns={isTabletOrMobile ? mobileColumns : tableColumns}
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
