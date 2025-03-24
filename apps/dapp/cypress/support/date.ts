import { start } from "repl";

/**
 *  Replaces the native DateConstructor with version that returns a static value for Date.now().
 * @param win
 * @param staticDate the static date to be returned
 *
 * @devnote - This was created to overcome an issue with react-query and cy.clock()
 *            When using cy.clock() react-query seems to stop executing until the clock is restored
 *            Happy to revert back to it if we can overcome this issue, currently happening in purchase tests
 */
export function mockDateConstructor(
  win: Cypress.AUTWindow,
  staticDate: string | number
) {
  const OriginalDate = win.Date;
  win.OriginalDate = win.OriginalDate;

  const testDate = new Date(staticDate);

  class MockDate extends OriginalDate {
    constructor(...args: Parameters<typeof Date>) {
      if (args.length === 0) {
        super(testDate);
      } else {
        super(...args);
      }
    }

    static now() {
      return testDate.getTime();
    }
  }

  win.Date = MockDate as DateConstructor;
}

export function restoreDateConstructor(win: Cypress.AUTWindow) {
  if (win.OriginalDate) {
    win.Date = win.OriginalDate;
  }
}
