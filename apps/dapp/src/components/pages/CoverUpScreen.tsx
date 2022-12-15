import { AppBackground, ProtocolLogo } from "ui";
import { HashRouter as Router } from "react-router-dom";

export const CoverUpScreen = () => {
  return (
    <Router>
      <div className="absolute inset-0 z-50 h-[100vh] w-full overflow-y-hidden bg-light-base">
        <AppBackground />
        <div className="flex h-full items-center justify-center ">
          <div>
            <a href="https://bondprotocol.finance">
              <ProtocolLogo className="mx-auto" />
            </a>
            <p className="my-auto mt-8 text-center text-2xl">Coming Soon</p>
          </div>
        </div>
      </div>
    </Router>
  );
};
