import { Tooltip } from "components";

describe("<Tooltip />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Tooltip content="im tooltip" iconClassname="fill-white" />);
  });
});
