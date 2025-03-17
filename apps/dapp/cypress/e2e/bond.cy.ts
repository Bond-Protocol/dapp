import { COMPONENTS, URLS } from "cypress/constants";
import globalDataStub from "src/mocks/stubs/global-data-stub";

const mockMarket = globalDataStub.data.tokens[0].markets[0];
const MARKET_LIVE_TIMESTAMP = 1741899464000;

describe("Bonding", () => {
  beforeEach(() => {
    //TODO: fix uncaught exceptions and remove this
    Cypress.on("uncaught:exception", () => {
      return false;
    });
  });

  it("Should be able to bond", async () => {
    const clock = cy.clock(MARKET_LIVE_TIMESTAMP);
    cy.visit(URLS.MARKET(+mockMarket.chainId, +mockMarket.marketId));
    cy.connectWallet();
    cy.get(COMPONENTS.BOND_INPUT).type("1002");
    cy.wait(100);
    cy.get(COMPONENTS.BOND_BUTTON).click();

    clock.then(async (c) => await c.restore());
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
