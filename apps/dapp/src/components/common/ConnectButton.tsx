import { ConnectButton as ConnectButtonUnstyled } from "@rainbow-me/rainbowkit";
import { Button, Icon } from "ui";
import arbitrum from "assets/icons/arbitrum.svg";

export interface ConnectButtonProps {
  full?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
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
        console.log({ chain });

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
                    Connect Wallet
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
                    variant="ghost"
                    onClick={openAccountModal}
                    type="button"
                    className="my-auto w-full px-4 font-mono hover:cursor-pointer"
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
