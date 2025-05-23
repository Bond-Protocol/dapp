import { COMPONENTS, TIME, URLS } from "cypress/constants";
import globalDataStub from "src/mocks/stubs/global-data-stub";

const MOCK_MARKET = globalDataStub.data.tokens[0].markets[0];
const VESTING_DATE = Date.now() + Math.ceil(+MOCK_MARKET.vesting * 1000);
const TIMESTAMP = Math.ceil(VESTING_DATE / 1000).toString();

describe("Claim Bond", () => {
  let snapshotId: string;

  beforeEach(() => {
    return cy.task("takeSnapshot").then((id) => {
      snapshotId = id as string;
      cy.task("setNextBlockTimestamp", TIMESTAMP);
      return null;
    });
  });

  afterEach(() => {
    if (snapshotId) {
      return cy.task("revertSnapshot", snapshotId);
    }
  });

  it("Should be able to redeem a bond", () => {
    cy.visit(URLS.DASHBOARD);

    cy.contains("button", "Claim", { timeout: 20000 }).click();

    cy.get(COMPONENTS.MODAL_TITLE, {
      timeout: TIME.TRANSACTION_TIMEOUT,
    }).should("have.text", "Transaction Successful!");
  });
});
