import { InfoLabel } from "ui";

export const UserMarkets = () => {
  return (
    <div>
      <div className="flex gap-x-4">
        <InfoLabel label="Total Bonded Value"></InfoLabel>
        <InfoLabel label="Bonds Issued"></InfoLabel>
        <InfoLabel label="Unique Bonders"></InfoLabel>
      </div>
    </div>
  );
};
