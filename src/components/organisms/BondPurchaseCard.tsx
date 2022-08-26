import Link from "components/atoms/Link";
import { InputCard } from "components/molecules/InputCard";
import { PurchaseSummaryCard } from "components/molecules/PurchaseSummaryCard";

const fields = [
  { label: "You will get", value: "18 OHM" },
  { label: "Available in Bond", value: "10.01231 OHM", tooltip: "Soon™" },
  { label: "Network Fee", value: "0.01231 OHM", tooltip: "Soon™" },
  {
    label: "Bond Contract",
    value: <Link>View on Etherscan</Link>,
    tooltip: "Soon™",
  },
];

export const BondPurchaseCard = () => {
  return (
    <>
      <InputCard isConnected={true} />
      <PurchaseSummaryCard fields={fields} />
    </>
  );
};
