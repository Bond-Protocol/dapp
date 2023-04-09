import BaseTester from "./BaseTester";
import {
  CreateMarketScreen,
  CreateMarketProvider,
  CreateMarketScreenProps,
  CreateMarketState,
} from "components";
import { list } from "utils";

export const defaultProps: CreateMarketScreenProps = {
  tokens: list,
  onSubmitCreation: (state) => {
    console.log({ state });
  },
  onSubmitAllowance: () => {},
  onSubmitMultisigCreation: () => {},
  fetchAllowance: () => Promise.resolve("10000000"),
  getTeller: () => "",
  getTxBytecode: () => "",
  chain: "1",
  projectionData: [],
  creationHash: "",
  blockExplorerUrl: "",
  blockExplorerName: "",
};

export default class CreateMarketTester extends BaseTester {
  props: CreateMarketScreenProps;
  providerProps: any;

  //@ts-ignore
  constructor(props: CreateMarketScreenProps = defaultProps) {
    super();
    this.props = props;
  }

  mount(props?: CreateMarketScreenProps, initialState?: CreateMarketState) {
    if (props) {
      this.props = props;
    }

    cy.mount(
      <CreateMarketProvider initialState={initialState}>
        <CreateMarketScreen {...this.props} />
      </CreateMarketProvider>
    );
  }

  getSelf() {
    return cy.get("#cm-root");
  }

  getPayoutToken() {
    return cy.get("#cm-payout-token-picker");
  }

  getQuoteToken() {
    return cy.get("#cm-quote-token-picker");
  }

  getVesting() {
    return cy.get("#cm-vesting-picker");
  }

  getCapacity() {
    return cy.get("#cm-capacity-picker");
  }

  getCapacityType() {
    return cy.get("#cm-capacity-type-picker");
  }

  getPriceModelPicker() {
    return cy.get("#cm-price-model-picker");
  }

  getChart() {
    return cy.get("#cm-projection-chart");
  }

  getStartDate() {
    return cy.get("#cm-start-date-picker");
  }

  getEndDate() {
    return cy.get("#cm-end-date-picker");
  }

  getConfirmButton() {
    return cy.get("#cm-pre-submit");
  }

  getConfirmButtonMultisig() {
    return cy.get("#cm-pre-submit-ms");
  }

  getSubmitAllowanceButton() {
    return cy.get("#cm-confirm-modal-submit-allowance");
  }

  getSubmitDeployButton() {
    return cy.get("#cm-confirm-modal-submit");
  }
}
