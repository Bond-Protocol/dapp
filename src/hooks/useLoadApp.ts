import type {Provider} from "@wagmi/core";
import {useEffect, useState} from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";

import {providers} from "services/owned-providers";

type AppState = {
  markets: unknown;
};

export const useLoadApp = () => {
  const [state, setState] = useState<AppState>();

  useEffect(() => {
    // we can load/call everything we need in here
    // and set it as state afterwards
    // should be simpler than having a store
    function loadApp() {
      const goerliProvider: Provider = providers.goerli;

      console.log({
        contractLibrary,
        bondLibrary,
        providers,
        goerliProvider,
      });

      // const balance = await contractLibrary.getBalance(
      //   '0xwhatever',
      //   '0xwhatever',
      //   goerliProvider
      // );

      //just set whatever we need as state bellow
      //setState({ markets: {} })
    }

    void loadApp();
  }, []);

  return state;
};
