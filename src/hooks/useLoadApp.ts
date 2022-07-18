import type { Provider } from "@wagmi/core";
import { useState, useEffect } from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";

import { providers } from "services/read-providers";

export const useLoadApp = () => {
  const [initialState, setState] = useState();

  // example provider

  useEffect(() => {
    // we can load/call everything we need in here
    // and set it as state afterwards
    // should be simpler than having a store
    async function loadApp() {
      const goerliProvider: Provider = providers.goerli[0];
      const rinkebyProvider: Provider = providers.rinkeby[0];

      console.log({
        contractLibrary,
        bondLibrary,
        providers,
        goerliProvider,
        rinkebyProvider,
      });

      // const balance = await contractLibrary.getBalance(
      //   '0xwhatever',
      //   '0xwhatever',
      //   goerliProvider
      // );
      //just set whatever we need as state bellow
      //setState()
    }

    void loadApp();
  });

  return { initialState };
};
