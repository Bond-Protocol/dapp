import { atom } from "jotai";
import { environment } from "src/environment";

const isTestnet = environment.isTestnet;

const testnetMode = atom(isTestnet);

export default testnetMode;
