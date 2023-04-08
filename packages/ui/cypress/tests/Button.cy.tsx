import { Button } from "components/atoms/Button";

describe("<Button />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button>hello</Button>);
  });
});
