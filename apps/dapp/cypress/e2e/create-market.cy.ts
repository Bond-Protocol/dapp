import { URLS, COMPONENTS, TOKEN_ADDRESSES, TIME } from "cypress/constants";

describe("Create Bond Market", () => {
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

  it("Should be able to create a bond market", () => {
    cy.visit(URLS.CREATE);
    cy.get(COMPONENTS.CREATE_MARKET.PAYOUT_TOKEN).click();

    const payoutInput = cy.get(COMPONENTS.CREATE_MARKET.TOKEN_ADDRESS);
    cy.wait(1000); //TODO: immediately typing results in rerendering
    payoutInput.type(TOKEN_ADDRESSES.PAYOUT);
    cy.get(COMPONENTS.CREATE_MARKET.TOKEN_IMPORT_BUTTON).click();

    cy.get(COMPONENTS.CREATE_MARKET.VESTING).click();
    cy.contains("7 days").click();

    cy.get(COMPONENTS.CREATE_MARKET.QUOTE_TOKEN).click();
    cy.contains("USDC").click();

    cy.get(COMPONENTS.CREATE_MARKET.CAPACITY).type("100001");

    cy.get(COMPONENTS.CREATE_MARKET.INITIAL_PRICE).type("100");
    cy.get(COMPONENTS.CREATE_MARKET.MIN_PRICE).type("50");

    cy.get(COMPONENTS.CREATE_MARKET.START_DATE).click();
    cy.get(COMPONENTS.CREATE_MARKET.DATE_CONFIRM).click();

    cy.get(COMPONENTS.CREATE_MARKET.END_DATE).click();
    cy.get(COMPONENTS.CREATE_MARKET.MARKET_LENGTH_INPUT).type("7");
    cy.get(COMPONENTS.CREATE_MARKET.DATE_CONFIRM).click();

    cy.get(COMPONENTS.CREATE_MARKET.CONFIRM).click();
    cy.get(COMPONENTS.CREATE_MARKET.APPROVE_SPENDING).click();
    cy.get(COMPONENTS.CREATE_MARKET.SUBMIT, {
      timeout: TIME.TRANSACTION_TIMEOUT,
    }).click();

    cy.get(COMPONENTS.MODAL_TITLE, { timeout: 10000 }).should(
      "have.text",
      "Success!"
    );
  });
});
