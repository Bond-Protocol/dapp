export class DatePicker {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  get() {
    return cy.get(this.id);
  }

  open() {
    this.get().click();
  }

  nextMonth() {
    cy.get(".MuiPopperUnstyled-root").get("[name=next-month]").click();
  }

  chooseDay(day = "1") {
    cy.get(".MuiPopperUnstyled-root").contains(day).click();
  }
}
