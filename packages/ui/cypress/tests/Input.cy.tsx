import { Input } from "components";

describe("<Input />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Input subText="Hello" />);
  });
});
