import { useState, useEffect } from "react";
import { providers } from "services/read-providers";
import * as contractLibrary from "../../../contract-library/src/index";
import { Provider } from "@wagmi/core";

export const useLoadApp = () => {
  const [initialState, setState] = useState();

  // example provider
  const goerliProvider: Provider = providers.goerli[0];

  useEffect(() => {
    // we can load/call everything we need in here
    // and set it as state afterwards
    // should be simpler than having a store
    async function loadApp() {
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
