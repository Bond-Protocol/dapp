import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useTestnet = () => {
  const [isTestnet, setTestnet] = useAtom(testnetMode);

  const toggleTestnet = () => setTestnet((prev: boolean) => !prev);

  return { isTestnet, toggleTestnet };
};
