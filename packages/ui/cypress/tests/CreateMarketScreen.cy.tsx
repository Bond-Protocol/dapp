import { CreateMarketScreen, CreateMarketProvider } from "components";

describe("<CreateMarketScreen />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <div>
        <CreateMarketProvider>
          <CreateMarketScreen
            tokens={[]}
            onSubmitCreation={() => {}}
            onSubmitAllowance={() => {}}
            onSubmitMultisigCreation={() => {}}
            fetchAllowance={() => Promise.resolve("1")}
            getTeller={() => ""}
            getTxBytecode={() => ""}
            chain={"1"}
            projectionData={[]}
            creationHash=""
            blockExplorerUrl=""
            blockExplorerName=""
          />
        </CreateMarketProvider>
      </div>
    );
  });
});
