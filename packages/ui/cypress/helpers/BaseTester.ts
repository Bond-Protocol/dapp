export default class BaseTester {
  protected get(value: string) {
    return cy.get(value);
  }

  protected selectDropdownOption(field: string, option: string) {
    const select = cy.get(field);

    select.click();

    select.next().children("ul").contains(option).first().click();

    return select;
  }
}
