import { ConnectButton as ConnectButtonUnstyled } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Button } from "..";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";

export const ConnectButton = () => {
  const [hovering, setHovering] = useState(false);
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
                    className="flex justify-center"
                    variant="ghost"
                    onClick={openConnectModal}
                  >
                    <WalletIcon className="fill-white my-auto hover:fill-brand-yella hover:color-brand-yella" />
                    <p className="pl-2 capitalize font-light text-sm">
                      Connect
                    </p>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="px-2.5 text-red-400 border-red-400"
                    variant="secondary"
                    onClick={openChainModal}
                  >
                    Switch Network
                  </Button>
                );
              }
              return (
                <div className="flex">
                  {chain.hasIcon && (
                    <div
                      onClick={openChainModal}
                      className="mr-3 rounded-full my-auto"
                    >
                      {chain.iconUrl && (
                        <img
                          className="hover:cursor-pointer"
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                        />
                      )}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={openAccountModal}
                    type="button"
                    thin
                    className="font-extralight hover:cursor-pointer"
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
