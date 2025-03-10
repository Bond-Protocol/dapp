/// <reference types="cypress" />

Cypress.Commands.add("shouldNotRenderErrorPage", () => {
  // Timeout required because the error page might not appear until the whole page has rendered
  cy.wait(500).get("#__BOND_ERROR_PAGE__").should("not.exist");
});

Cypress.Commands.add("shouldRenderPageWithId", (id) => {
  cy.get(`#${id}`, { timeout: 10000 }).should("exist");
});
