import { COMPONENTS, URLS } from "cypress/constants";
import globalDataStub from "src/mocks/stubs/global-data-stub";

const mockMarket = globalDataStub.data.tokens[0].markets[0];

describe("Bonding", () => {
  beforeEach(() => {
    //TODO: fix uncaught exceptions and remove this
    Cypress.on("uncaught:exception", () => {
      return false;
    });
  });

  it("Should be able to bond", () => {
    cy.visit(URLS.MARKET(+mockMarket.chainId, +mockMarket.marketId));
    cy.get(COMPONENTS.BOND_INPUT).type("1000");
    cy.get(COMPONENTS.BOND_BUTTON).click();

    cy.get(COMPONENTS.BOND_BUTTON, { timeout: 10000 })
      .should("have.text", "BOND")
      .click();

    cy.get(COMPONENTS.BOND_WARNING_CHECKMARK).click();
    cy.get(COMPONENTS.BOND_CONFIRM_BUTTON).click();
    cy.get(COMPONENTS.MODAL_TITLE, { timeout: 10000 }).should(
      "have.text",
      "Transaction Successful!"
    );
  });
});
