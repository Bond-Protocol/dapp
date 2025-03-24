/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    shouldNotRenderErrorPage(): void;
    shouldRenderPageWithId(id: string): void;
    connectWallet(): void;
    mockDate(date: string | number): Chainable<AUTWindow>;
    restoreDate(): Chainable<AUTWindow>;
  }

  interface ApplicationWindow {
    OriginalDate?: DateConstructor;
  }
}
