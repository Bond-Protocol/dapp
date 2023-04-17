import BaseTester from "./BaseTester";

export default class DateTester extends BaseTester {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  open() {
    return cy.get(this.id).click();
  }

  getLength() {
    this.open();
    return cy.get(".bp-manual-day-input").children().first();
  }

  getDatePicker() {
    this.open();
    return cy.contains("DATE").click();
  }

  nextMonth() {
    return cy.get("[name=next-month]").click();
  }

  pickFirstDayOfMonth() {
    return cy.get(".rdp-row").contains(/^1$/).click();
  }

  pickTime(time = "1620") {
    return cy.get(".time-picker").type(time);
  }

  confirm() {
    return cy.get("#end-date-select-button").click();
  }
}
