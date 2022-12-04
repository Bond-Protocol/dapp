import { ConnectButton as ConnectButtonUnstyled } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Button } from "ui";
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
                    className="flex justify-center p-3"
                    variant="ghost"
                    onClick={openConnectModal}
                  >
                    <WalletIcon className="hover:color-light-secondary my-auto h-[20px] w-[20px] fill-white hover:fill-light-secondary" />
                    <p className="pl-2 text-sm font-light capitalize">
                      Connect
                    </p>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="border-red-400 px-2.5 text-red-400"
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
                    <div onClick={openChainModal} className="my-auto mr-3 ">
                      {chain.iconUrl && (
                        <div className="max-h-[40px] w-10 rounded border p-1">
                          <img
                            className="mx-auto hover:cursor-pointer"
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
                    thin
                    className="p-3 font-mono font-medium hover:cursor-pointer"
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
