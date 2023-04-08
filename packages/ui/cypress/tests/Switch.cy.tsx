import { Switch } from "components";

describe("<Switch />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Switch />);
  });
});
