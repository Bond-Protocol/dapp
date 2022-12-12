import { ConnectButton as ConnectButtonUnstyled } from "@rainbow-me/rainbowkit";
import { Button } from "ui";

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
                  {chain.hasIcon && (
                    <div onClick={openChainModal} className="my-auto">
                      {chain.iconUrl && (
                        <div className="max-h-[40px]">
                          <img
                            className="hover:cursor-pointer"
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={openAccountModal}
                    type="button"
                    className="my-auto w-full px-4 font-mono font-light hover:cursor-pointer"
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
