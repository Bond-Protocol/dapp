import { useGetGlobalData } from "hooks/useGetGlobalData";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useTokens } from "hooks/useTokens";
import { InfoLabel } from "ui";

export const ProtocolMetrics = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const { tbv } = useTokens();
  const { data } = useGetGlobalData();
  const { totalPurchases, uniqueBonders } = data;
  const bonderTitle = isTabletOrMobile ? "BONDERS" : "UNIQUE BONDERS";

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 pb-10 pt-4 md:flex">
      <InfoLabel
        reverse
        label="Total Bonded Value"
        tooltip="Total value, in USD, of assets acquired by tokens through bonds"
        className="col-span-2"
      >
        {tbv}
      </InfoLabel>
      <InfoLabel
        reverse
        label="Total Bonds"
        tooltip="Total count of bonds acquired through the protocol's smart contracts"
      >
        {totalPurchases}
      </InfoLabel>
      <InfoLabel
        reverse
        label={bonderTitle}
        tooltip="Total count of unique addresses that acquired bonds"
      >
        {uniqueBonders}
      </InfoLabel>
    </div>
  );
};
