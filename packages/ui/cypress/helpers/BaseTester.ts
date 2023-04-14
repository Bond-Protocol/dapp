export default class BaseTester {
  get(value: string) {
    return cy.get(value);
  }
}
