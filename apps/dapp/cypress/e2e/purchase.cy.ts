import { COMPONENTS, URLS } from "cypress/constants";
import globalDataStub from "src/mocks/stubs/global-data-stub";

const mockMarket = globalDataStub.data.tokens[0].markets[0];
const MARKET_LIVE_TIMESTAMP = 1741899464000;

describe("Purchase Bond", () => {
  let snapshotId: string;
  beforeEach(() => {
    return cy.task("takeSnapshot").then((id) => {
      snapshotId = id as string;
    });
  });

  afterEach(() => {
    if (snapshotId) {
      return cy.task("revertSnapshot", snapshotId);
    }
  });

  it("Should be able to bond", () => {
    cy.clock(MARKET_LIVE_TIMESTAMP);
    cy.visit(URLS.MARKET(+mockMarket.chainId, +mockMarket.marketId));

    cy.wait(1000); // Wait for page to load with mocked clock

    cy.clock().invoke("restore");

    cy.connectWallet();
    cy.get(COMPONENTS.BOND_INPUT).type("1000");
    cy.wait(100);
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
