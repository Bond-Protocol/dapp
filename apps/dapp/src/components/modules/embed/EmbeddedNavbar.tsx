import { ConnectButton, NavbarTabs } from "components/common";
import { useMemo } from "react";
import { ProtocolLogo } from "ui";
import { useAccount } from "wagmi";
import { useEmbedContext } from "./embed-context";

export const EmbeddedNavbar = () => {
  const { ownerAddress } = useEmbedContext();
  const { isConnected } = useAccount();

  const tabs = useMemo(
    () => [
      {
        label: "Markets",
        path: `/embed/markets?owner=${ownerAddress}`,
        group: "market",
      },
      { label: "Claim", path: "/embed/dashboard", group: "dashboard" },
    ],
    [ownerAddress]
  );

  return (
    <div className="flex items-center justify-between bg-light-base p-1">
      <div className="flex items-center gap-x-2">
        <ProtocolLogo small />
        {isConnected && <ConnectButton hideAccount />}
      </div>
      <NavbarTabs tabs={tabs} />

      <ConnectButton hideChain />
    </div>
  );
};
