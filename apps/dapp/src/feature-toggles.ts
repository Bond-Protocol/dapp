const LIMIT_ORDERS = import.meta.env.VITE_FEATURE_TOGGLE_LIMIT_ORDER === "true";
const ORACLE_BONDS =
  import.meta.env.VITE_FEATURE_TOGGLE_ORACLE_BONDS === "true";

export const featureToggles = {
  /**Limit order features for bond purchases*/
  LIMIT_ORDERS,
  /**Ability to create oracle bond*/
  ORACLE_BONDS,
} as const;

export type FeatureToggle = keyof typeof featureToggles;
