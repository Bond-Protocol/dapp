import { TokenInput } from "components";

describe("<TokenInput />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TokenInput />);
  });
});
