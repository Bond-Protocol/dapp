import CreateMarketPage, {
  CreateMarketConfiguration,
} from "../pages/create-market";

const VALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a217988B";
const OHM_MAINNET_ADDRESS = "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5";
const DAI_MAINNET_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

const page = new CreateMarketPage();

const BASIC_MARKET_CONFIGURATION: CreateMarketConfiguration = {
  marketIssuerAddress: VALID_ISSUER_ADDRESS,
  payoutTokenAddress: OHM_MAINNET_ADDRESS,
  quoteTokenAddress: DAI_MAINNET_ADDRESS,
  marketCapacity: "333333333",
};

const ARBITRUM_MARKET: CreateMarketConfiguration = {
  marketIssuerAddress: "0xea8a734db4c7EA50C32B5db8a0Cb811707e8ACE3",
  payoutTokenAddress: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
  quoteTokenAddress: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  marketCapacity: "42069",
  chain: "Arbitrum",
};

describe("Create Markets", () => {
  beforeEach(() => {
    page.visit();
  });

  it("Switches chains", () => {
    page.switchChain("Arbitrum");

    page.getSelectedChain().contains("Arbitrum");
    page.getSelectedChain().should("not.contain", "Ethereum");
  });

  it("Validates a verified issuer", () => {
    page.getMarketOwnerAddress().type(VALID_ISSUER_ADDRESS);
    page.getMarketOwnerAddress().should("have.value", VALID_ISSUER_ADDRESS);

    cy.contains("Verified as OlympusDAO");
  });

  it("Validates tokens", () => {
    page.getQuoteTokenPrice().should("be.empty");
    page.getPayoutTokenPrice().should("be.empty");

    page.getPayoutToken().type(OHM_MAINNET_ADDRESS);
    page.getQuoteToken().type(DAI_MAINNET_ADDRESS);

    page.getPayoutCheckbox().click();
    page.getQuoteCheckbox().click();

    page.getQuoteTokenPrice().should("have.value", "DAI");
    page.getPayoutTokenPrice().should("have.value", "OHM");
  });

  it("Fills market capacity", () => {
    page.getMarketCapacity().type("10000");
    page.getMarketCapacity().should("have.value", "10000");
  });

  it("Sets a market end date", () => {
    page.getEndDatePicker().click();

    cy.get(".MuiPopperUnstyled-root").get("[name=next-month]").click();
    cy.get(".MuiPopperUnstyled-root").contains("1").click();
  });

  it("Sets a bond vesting date", () => {
    page.getVestingDatePicker().click();

    cy.get(".MuiPopperUnstyled-root").get("[name=next-month]").click();
    cy.get(".MuiPopperUnstyled-root").contains("4").click();
  });

  it("Creates a basic Ethereum market", () => {
    page.createMarket(BASIC_MARKET_CONFIGURATION);
    cy.wait(5000);
    cy.contains("CONFIRM INFORMATION").click();

    cy.contains("Confirm and deploy").should("exist");
  });

  it.only("Creates an Arbitrum market", () => {
    page.createMarket(ARBITRUM_MARKET);

    cy.wait(5000);
    cy.contains("CONFIRM INFORMATION").click();

    cy.contains("Confirm and deploy").should("exist");
  });
});
