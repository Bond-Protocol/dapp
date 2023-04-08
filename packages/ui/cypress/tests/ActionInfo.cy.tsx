import { ActionInfo } from "components";

describe("<ActionInfo />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ActionInfo leftLabel="ok" rightLabel="cool" />);
  });
});
