//ids
const APP_ROOT = "__ROOT_PAGE__";
const MARKET_LIST_PAGE = "__MARKETS_PAGE__";
const MARKET_PAGE = "__MARKET_PAGE__";
const CREATE_PAGE = "__CREATE_BOND_PAGE__";
const DASHBOARD_PAGE = "__DASHBOARD_PAGE__";

//urls
const BASE_URL = "http://localhost:5173/#";
const MARKETS = BASE_URL + "/markets";
const CREATE = BASE_URL + "/create";
const DASHBOARD = BASE_URL + "/dashboard";
const MARKET = (chainId: number, marketId: number) =>
  `${BASE_URL}/market/${chainId}/${marketId}`;

//components
const testId = (id: string) => `[data-testid='${id}']`;

const BOND_INPUT = testId("bond-input");
const BOND_BUTTON = testId("bond-button");
const BOND_WARNING_CHECKMARK = testId("bond-warning-checkbox");
const BOND_CONFIRM_BUTTON = testId("bond-confirm-button");
const BOND_PURCHASE_SUCCESS_DIALOG = testId("bond-purchase-success-dialog");
const MODAL_TITLE = testId("modal-title");

export const IDS = {
  APP_ROOT,
  MARKET_PAGE,
  MARKET_LIST_PAGE,
  DASHBOARD_PAGE,
  CREATE_PAGE,
};

export const URLS = {
  BASE_URL,
  MARKETS,
  DASHBOARD,
  CREATE,
  MARKET,
};

export const COMPONENTS = {
  BOND_INPUT,
  BOND_BUTTON,
  BOND_WARNING_CHECKMARK,
  BOND_CONFIRM_BUTTON,
  BOND_PURCHASE_SUCCESS_DIALOG,
  MODAL_TITLE,
};
