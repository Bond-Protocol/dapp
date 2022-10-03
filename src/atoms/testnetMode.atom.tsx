import { atom } from "jotai";

const isTestnet = import.meta.env.VITE_TESTNET;

const testnetMode = atom(isTestnet);

export default testnetMode;
