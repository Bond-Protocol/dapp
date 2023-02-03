const VALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a217988B";
const INVALID_ISSUER_ADDRESS = "0x245cc372C84B3645Bf0Ffe6538620B04a21742069";

describe("Create Markets", () => {
  it("Loads the page", () => {
    cy.visit("/create");
  });

  it("Checks for content", () => {
    cy.visit("/create");
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

  it.only("Switches chains", () => {
    cy.visit("/create");

    cy.get("#bp__chain_picker_input").children().contains("Ethereum");

    cy.get("#bp__chain_picker_input").click();
    cy.get("#bp__chain_picker_input")
      .next()
      .children("ul")
      .get("li:nth-child(3)")
      .first()
      .click();

    cy.get("#bp__chain_picker_input").children().contains("Arbitrum");

    cy.get("#bp__chain_picker_input")
      .children()
      .should("not.contain", "Ethereum");
  });

  it("Validates a verified issuer", () => {
    cy.visit("/create");
    cy.get("#bp__market_owner_address").type(VALID_ISSUER_ADDRESS);
    cy.get("#bp__market_owner_address").should(
      "have.value",
      VALID_ISSUER_ADDRESS
    );
    cy.contains("Verified as OlympusDAO");
  });
});
