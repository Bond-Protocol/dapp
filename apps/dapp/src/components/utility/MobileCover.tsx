import { AppBackground } from "ui";
import ProtocolLogo from "../../assets/logo.svg?react";

export const MobileCover = () => {
  return (
    <div className="fml:hidden">
      <AppBackground />
      <div className="flex h-[100vh] flex-col place-items-center justify-center">
        <ProtocolLogo />
        <div className="px-[10vw] pt-8 text-center font-jakarta">
          <p>Our dApp is in βeta and is best experienced on desktop.</p>

          <p className="mt-6">Mobile compatibility coming soon™</p>
        </div>
      </div>
    </div>
  );
};
