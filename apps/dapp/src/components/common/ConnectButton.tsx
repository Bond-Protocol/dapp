import { ConnectButton as ConnectButtonUnstyled } from "@rainbow-me/rainbowkit";
import { Button, Icon } from "ui";
import arbitrum from "assets/icons/arbitrum.svg";
import repeatIcon from "assets/icons/loop.svg";
import { useMediaQueries } from "hooks/useMediaQueries";

export interface ConnectButtonProps {
  full?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  const { isTabletOrMobile } = useMediaQueries();
  return (
    <ConnectButtonUnstyled.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            className={props.full ? "w-full" : ""}
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="w-full px-4 align-top font-fraktion"
                  >
                    {isTabletOrMobile ? "Connect" : "Connect Wallet"}
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="w-full border-light-danger px-4 font-fraktion text-light-secondary-10"
                    variant="secondary"
                    onClick={openChainModal}
                  >
                    Switch Network
                  </Button>
                );
              }
              return (
                <div className="flex gap-4">
                  <div onClick={openChainModal} className="my-auto">
                    <div className="max-h-[40px]">
                      <Icon
                        width={32}
                        height={32}
                        className="hover:cursor-pointer"
                        alt={chain.name ?? "Chain icon"}
                        src={
                          chain.id === 421613 //TODO: remove goerli arb icon hack
                            ? arbitrum
                            : chain.iconUrl ?? repeatIcon
                        }
                      />
                    </div>
                  </div>
                  <Button
                    thin
                    variant="ghost"
                    onClick={openAccountModal}
                    type="button"
                    className="my-auto w-full font-mono hover:cursor-pointer md:px-4"
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButtonUnstyled.Custom>
  );
};
