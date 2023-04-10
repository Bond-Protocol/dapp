import { TokenInput } from "components";
import ethereumIcon from "assets/icons/ethereum.svg";

describe("<TokenInput />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TokenInput symbol="ETH" icon={ethereumIcon} value="" />);
    cy.get("input").should("exist");
    cy.get("input").type("1000");
  });
});
