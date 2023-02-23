import CreateMarketPage from "../pages/create-market";

const VALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a217988B";
const INVALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a21742069";

const page = new CreateMarketPage();

describe("Create Markets", () => {
  beforeEach(() => {
    page.visit();
  });

  it("Checks for content", () => {
    cy.contains("SET UP");
    cy.contains("Chain");
    cy.contains("Market Owner Address");
    cy.contains("Payout Token");
    cy.contains("Quote Token");
    cy.contains("Payout Token Price");
    cy.contains("Minimum Exchange Rate");
    cy.contains("Market Capacity");
    cy.contains("Capacity Token");
    cy.contains("Market End Date");
    cy.contains("Vesting Type");
    cy.contains("Bond Vesting Date");
    cy.contains("Advanced Setup");
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

  it("Validates tokens", () => {});
});
