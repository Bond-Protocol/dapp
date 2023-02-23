import Page from "./page";

export default class CreateMarketPage extends Page {
  visit() {
    cy.visit("/create");
  }

  getSelectedChain() {
    return cy.get("#bp__chain_picker_input");
  }

  getMarketOwnerAddress() {
    return cy.get("#bp__market_owner_address");
  }

  switchChain(chain: string) {
    cy.get("#bp__chain_picker_input").click();

    cy.get("#bp__chain_picker_input")
      .next()
      .children("ul")
      .contains(chain)
      .first()
      .click();
  }
}
