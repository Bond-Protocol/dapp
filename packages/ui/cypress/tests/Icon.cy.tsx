import { Icon } from "components";
import tokenIcon from "assets/icons/ethereum.svg";

describe("<Icon />", () => {
  it("renders", () => {
    cy.viewport(550, 550);
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Icon src={tokenIcon} />);
  });
});
