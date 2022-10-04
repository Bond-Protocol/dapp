import { AppBackground } from "components/atoms/AppBackground";
import { ReactComponent as ProtocolLogo } from "../../assets/logo.svg";

export const MobileCover = () => {
  return (
    <div className="fml:hidden">
      <AppBackground />
      <div className="flex flex-col place-items-center justify-center h-[100vh]">
        <ProtocolLogo />
        <div className="font-jakarta pt-8 text-center">
          Please switch to desktop <br />
          to use the application
        </div>
      </div>
    </div>
  );
};
