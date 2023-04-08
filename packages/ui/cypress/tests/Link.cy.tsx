import { Link } from "components";

describe("<Link />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Link />);
  });
});
