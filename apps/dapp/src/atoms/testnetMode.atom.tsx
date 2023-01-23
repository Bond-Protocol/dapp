import { atom } from "jotai";
import { environment } from "src/env-state";

const isTestnet = environment.isTestnet;

const testnetMode = atom(isTestnet);

export default testnetMode;
