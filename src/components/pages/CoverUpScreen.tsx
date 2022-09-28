import { AppBackground } from "components/atoms/AppBackground";
import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { HashRouter as Router } from "react-router-dom";

export const CoverUpScreen = () => {
  return (
    <Router>
      <div className="absolute inset-0 w-full h-[100vh] bg-brand-turtle-blue z-50 overflow-y-hidden">
        <AppBackground />
        <div className="flex justify-center items-center h-full ">
          <div>
            <a href="https://bondprotocol.finance">
              <ProtocolLogo className="mx-auto" />
            </a>
            <p className="text-2xl text-center my-auto mt-8">Coming Soon</p>
          </div>
        </div>
      </div>
    </Router>
  );
};
