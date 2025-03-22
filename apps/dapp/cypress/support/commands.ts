/// <reference types="cypress" />

import { mockDateConstructor, restoreDateConstructor } from "./date";

Cypress.Commands.add("shouldNotRenderErrorPage", () => {
  // Timeout required because the error page might not appear until the whole page has rendered
  cy.wait(500).get("#__BOND_ERROR_PAGE__").should("not.exist");
});

Cypress.Commands.add("shouldRenderPageWithId", (id) => {
  cy.get(`#${id}`, { timeout: 10000 }).should("exist");
});

Cypress.Commands.add("connectWallet", () => {
  cy.contains("button", "Connect Wallet").click();
  cy.contains("button", "Auto-Signer").click();
});

Cypress.Commands.add("mockDate", (date) => {
  return cy.window().then((win) => mockDateConstructor(win, date));
});

Cypress.Commands.add("restoreDate", () => {
  return cy.window().then(restoreDateConstructor);
});
