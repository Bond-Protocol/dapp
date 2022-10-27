import { atom } from "jotai";
import { environment } from "src/env-state";

const isTestnet = environment.isTesting || environment.isStaging;

const testnetMode = atom(isTestnet);

export default testnetMode;
