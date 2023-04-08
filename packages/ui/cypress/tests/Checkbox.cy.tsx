import { Checkbox } from "components";

describe("<Checkbox />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Checkbox />);
  });
});
