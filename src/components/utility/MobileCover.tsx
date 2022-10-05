import { AppBackground } from "components/atoms/AppBackground";
import { ReactComponent as ProtocolLogo } from "../../assets/logo.svg";

export const MobileCover = () => {
  return (
    <div className="fml:hidden">
      <AppBackground />
      <div className="flex flex-col place-items-center justify-center h-[100vh]">
        <ProtocolLogo />
        <div className="font-jakarta pt-8 text-center px-[10vw]">
          <p>Our dApp is in βeta and is best experienced on desktop.</p>

          <p className="mt-6">Mobile compatibility coming soon™</p>
        </div>
      </div>
    </div>
  );
};
