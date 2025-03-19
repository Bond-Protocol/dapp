import { IDS, URLS } from "../constants";

describe("Smoke Tests", () => {
  it("Should render home page", () => {
    cy.visit(URLS.BASE_URL);
    cy.shouldRenderPageWithId(IDS.APP_ROOT);
  });

  it("Should render market list", () => {
    cy.visit(URLS.MARKETS);
    cy.shouldRenderPageWithId(IDS.MARKET_LIST_PAGE);
  });

  it("Should render dashboard", () => {
    cy.visit(URLS.DASHBOARD);
    cy.shouldRenderPageWithId(IDS.DASHBOARD_PAGE);
  });

  it("Should render create page", () => {
    cy.visit(URLS.CREATE);
    cy.shouldRenderPageWithId(IDS.CREATE_PAGE);
  });
});
