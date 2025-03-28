const LIMIT_ORDERS = import.meta.env.VITE_FEATURE_LIMIT_ORDERS === "true";
const ORACLE_BONDS = import.meta.env.VITE_FEATURE_ORACLE_BONDS === "true";
const CACHING_API = import.meta.env.VITE_FEATURE_CACHING_API === "true";

export const featureToggles = {
  /**Limit order features for bond purchases*/
  LIMIT_ORDERS,
  /**Ability to create oracle bond*/
  ORACLE_BONDS,
  /**Data Caching API*/
  CACHING_API,
} as const;

export type FeatureToggle = keyof typeof featureToggles;
