import { CreateMarketScreenProps } from "src/components";
import CreateMarketTester, {
  defaultProps,
} from "../helpers/CreateMarketTester";

const component = new CreateMarketTester();

const props: CreateMarketScreenProps = {
  ...defaultProps,
};

describe("<CreateMarketScreen />", () => {
  beforeEach(() => {
    //@ts-ignore
    component.mount(props);
  });

  it.only("Creates a dynamic discount market", () => {
    component.getPayoutToken().click();
    cy.contains("OHM").click();

    component.getQuoteToken().click();
    cy.contains("DAI").click();

    component.getVesting().click();
    cy.contains("7 days").click();

    component.getCapacity().type("100");

    component.getEndDate().click();

    cy.get(".bp-manual-day-input").children().first().type("10");
    cy.get("#end-date-select-button").click();

    component.getConfirmButton().click();

    component.getSubmitDeployButton().click();
  });
});
