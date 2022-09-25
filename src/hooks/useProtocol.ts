import * as contractLibrary from "@bond-protocol/contract-library";
import * as bondLibrary from "@bond-protocol/bond-library";
import { providers } from "services/owned-providers";

export const useProtocol = () => {
  return { contractLibrary, bondLibrary, providers };
};
