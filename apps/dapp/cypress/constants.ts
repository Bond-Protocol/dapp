//ids
const TOKENS_PAGE = "__TOKENS_PAGE__";
const MARKET_LIST_PAGE = "__MARKETS_PAGE__";
const MARKET_PAGE = "__MARKET_PAGE__";
const CREATE_PAGE = "__CREATE_BOND_PAGE__";
const DASHBOARD_PAGE = "__DASHBOARD_PAGE__";
const ANALYTICS_PAGE = "__ANALYTICS_PAGE_";

//urls
const BASE_URL = "/";
const MARKETS = "/markets";
const CREATE = "/create";
const DASHBOARD = "/dashboard";
const ANALYTICS = "/analytics";
const MARKET = (chainId: number, marketId: number) =>
  `/market/${chainId}/${marketId}`;

//components
const testId = (id: string) => `[data-testid='${id}']`;

//Bonding
const BOND_INPUT = testId("bond-input");
const BOND_BUTTON = testId("bond-button");
const BOND_WARNING_CHECKMARK = testId("bond-warning-checkbox");
const BOND_CONFIRM_BUTTON = testId("bond-confirm-button");
const BOND_PURCHASE_SUCCESS_DIALOG = testId("bond-purchase-success-dialog");
const MODAL_TITLE = testId("modal-title");
//Create Bond Market
const CREATE_MARKET = {
  ROOT: "#cm-root",
  PAYOUT_TOKEN: "#cm-payout-token-picker",
  QUOTE_TOKEN: "#cm-quote-token-picker",
  VESTING: "#cm-vesting-picker",
  CAPACITY: "#cm-capacity-picker",
  CAPACITY_TYPE: "#cm-capacity-type-picker",
  PRICE_MODEL: "#cm-price-model-picker",
  START_DATE: "#cm-start-date-picker",
  END_DATE: "#cm-end-date-picker",
  CHART: "#cm-projection-chart",
  CONFIRM: "#cm-pre-submit",
  CONFIRM_MULTISIG: "#cm-pre-submit-ms",
  APPROVE_SPENDING: "#cm-confirm-modal-submit-allowance",
  SUBMIT: "#cm-confirm-modal-submit",
  TOKEN_ADDRESS: testId("token-import-address"),
  TOKEN_IMPORT_BUTTON: testId("token-import-button"),
  INITIAL_PRICE: testId("price-model-initial-price"),
  MIN_PRICE: testId("price-model-min-price"),
  FIXED_PRICE: testId("price-model-fixed-price"),
  DATE_CONFIRM: testId("date-select-button"),
  MARKET_LENGTH_INPUT: testId("market-duration-in-days"),
};

export const IDS = {
  TOKENS_PAGE,
  MARKET_PAGE,
  MARKET_LIST_PAGE,
  DASHBOARD_PAGE,
  CREATE_PAGE,
  ANALYTICS_PAGE,
};

export const URLS = {
  BASE_URL,
  MARKETS,
  DASHBOARD,
  CREATE,
  MARKET,
  ANALYTICS,
};

export const COMPONENTS = {
  BOND_INPUT,
  BOND_BUTTON,
  BOND_WARNING_CHECKMARK,
  BOND_CONFIRM_BUTTON,
  BOND_PURCHASE_SUCCESS_DIALOG,
  MODAL_TITLE,
  CREATE_MARKET,
};

export const TOKEN_ADDRESSES = {
  PAYOUT: "0x0c5CD8F8e7D6995A67568f87969332f5C902e520",
  QUOTE: "0x4c9d75fbdF764D05dF654340A48f85Bc0216F8AB",
};

export const TIME = {
  TRANSACTION_TIMEOUT: 12 * 1000,
};
