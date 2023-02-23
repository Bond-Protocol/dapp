import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useTestnetMode = () => {
  return useAtom(testnetMode);
};
