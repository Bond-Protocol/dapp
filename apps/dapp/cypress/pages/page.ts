export default class Page {
  protected visit() {
    cy.visit("/");
  }

  protected getInputField(field: string) {
    return cy.get(field);
  }

  protected selectDropdownOption(field: string, option: string) {
    const select = cy.get(field);

    select.click();

    select.next().children("ul").contains(option).first().click();

    return select;
  }
}
