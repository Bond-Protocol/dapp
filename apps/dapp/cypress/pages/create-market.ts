import { DatePicker } from "./components/date-picker";
import Page from "./page";

const VALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a217988B";
const INVALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a21742069";

const OHM_MAINNET_ADDRESS = "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5";
const DAI_MAINNET_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

export type CreateMarketConfiguration = {
  marketIssuerAddress: string;
  quoteTokenAddress: string;
  payoutTokenAddress: string;
  marketCapacity: string;
  chain?: string;
  minimumExchangeRate?: string;
  endDate?: string;
  vestingDate?: string;
};

export default class CreateMarketPage extends Page {
  marketEndDatePicker: DatePicker;
  vestingDatePicker: DatePicker;

  constructor() {
    super();
    this.marketEndDatePicker = new DatePicker("#bp__market_end_date");
    this.vestingDatePicker = new DatePicker("#bp__vesting_date");
  }

  visit() {
    cy.visit("/create");
  }

  getSelectedChain() {
    return cy.get("#bp__chain_picker_input");
  }

  getMarketOwnerAddress() {
    return cy.get("#bp__market_owner_address");
  }

  getQuoteToken() {
    return cy.get("#bp__quote_token");
  }

  getPayoutToken() {
    return cy.get("#bp__payout_token");
  }

  getQuoteCheckbox() {
    return cy.get("#bp__quote_token_checkbox");
  }

  getPayoutCheckbox() {
    return cy.get("#bp__payout_token_checkbox");
  }

  getPayoutTokenPrice() {
    return cy.get("#bp__payout_token_price");
  }

  getQuoteTokenPrice() {
    return cy.get("#bp__quote_token_price");
  }

  getMarketCapacity() {
    return cy.get("#bp__market_capacity");
  }

  getEndDatePicker() {
    return cy.get("#bp__market_end_date");
  }

  getVestingDatePicker() {
    return cy.get("#bp__vesting_date");
  }

  switchChain(chain: string) {
    return this.selectDropdownOption("#bp__chain_picker_input", chain);
  }

  createMarket(config: CreateMarketConfiguration) {
    if (config.chain) {
      this.switchChain(config.chain);
    }

    this.getMarketOwnerAddress().type(config.marketIssuerAddress);

    this.getPayoutToken().type(config.payoutTokenAddress);
    this.getPayoutCheckbox().click();

    this.getQuoteToken().type(config.quoteTokenAddress);
    this.getQuoteCheckbox().click();

    this.getMarketCapacity().type(config.marketCapacity);

    this.marketEndDatePicker.open();
    this.marketEndDatePicker.nextMonth();
    this.marketEndDatePicker.chooseDay("1");

    this.vestingDatePicker.open();
    this.vestingDatePicker.nextMonth();
    this.marketEndDatePicker.chooseDay("4");
  }
}
