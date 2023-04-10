import instantIcon from "../assets/icons/vesting/instant.svg";
import fastIcon from "../assets/icons/vesting/fast.svg";
import normalIcon from "../assets/icons/vesting/normal.svg";
import slowIcon from "../assets/icons/vesting/slow.svg";

export const vestingOptions = [
  { id: "0", label: "Instant", value: "instant", image: instantIcon },
  { id: "7", label: "7 days", value: "7", image: fastIcon },
  { id: "14", label: "14 days", value: "14", image: normalIcon },
  { id: "28", label: "28 days", value: "28", image: slowIcon },
];
