import { expect } from "chai";
import CreateMarketTester, {
  defaultProps,
} from "../helpers/CreateMarketTester";

const component = new CreateMarketTester();

describe("<CreateMarketScreen />", () => {
  it("Creates a dynamic discount market", () => {
    const onSubmitSpy = cy.spy().as("onSubmitSpy");

    component.mount({ ...defaultProps, onSubmitCreation: onSubmitSpy });

    component.getPayoutToken().click();
    cy.contains("OHM").click();

    component.getQuoteToken().click();
    cy.contains("DAI").click();

    component.getVesting().click();
    cy.contains("7 days").click();

    component.getCapacity().type("100");

    component.endDateTester.getDatePicker();
    component.endDateTester.nextMonth();
    component.endDateTester.pickFirstDayOfMonth();
    component.endDateTester.pickTime();
    component.endDateTester.confirm();

    component.getConfirmButton().click();

    component
      .getSubmitDeployButton()
      .click()
      .then(() => {
        const calledWith = onSubmitSpy.getCall(0).args[0] as typeof target;

        expect(calledWith.quoteToken).to.be.deep.equal(target.quoteToken);
        expect(calledWith.payoutToken).to.be.deep.equal(target.payoutToken);

        expect(calledWith.allowance).to.be.equal(target.allowance);
        expect(calledWith.bondsPerWeek).to.be.equal(target.bondsPerWeek);

        expect(calledWith.capacityType).to.be.equal(target.capacityType);
        expect(calledWith.capacity).to.be.equal(target.capacity);
        expect(calledWith.recommendedAllowance).to.be.equal(
          target.recommendedAllowance
        );

        expect(calledWith.recommendedAllowanceDecimalAdjusted).to.be.equal(
          target.recommendedAllowanceDecimalAdjusted
        );

        expect(calledWith.isAllowanceSufficient).to.be.equal(
          target.isAllowanceSufficient
        );

        expect(calledWith.vesting).to.be.equal(target.vesting);
        expect(calledWith.vestingType).to.be.equal(target.vestingType);
        expect(calledWith.vestingString).to.be.equal(target.vestingString);
        expect(calledWith.priceModel).to.be.equal(target.priceModel);

        //expect(calledWith.maxBondSize).to.be.equal(target.maxBondSize);
        expect(calledWith.debtBuffer).to.be.equal(target.debtBuffer);
        expect(calledWith.depositInterval).to.be.equal(target.depositInterval);
        expect(calledWith.priceModel).to.be.deep.equal(target.priceModel);

        expect(calledWith.oracle).to.be.equal(false);

        //NEEDS BONDS PER WEEK
        //NEEDS DURATIONS AND DATES
      });
  });

  it("Creates a fixed discount market", () => {
    const onSubmitSpy = cy.spy().as("onSubmitSpy");

    component.mount({ ...defaultProps, onSubmitCreation: onSubmitSpy });
    component.getPayoutToken().click();
    cy.contains("OHM").click();

    component.getQuoteToken().click();
    cy.contains("DAI").click();

    component.getVesting().click();
    cy.contains("7 days").click();

    component.getCapacity().type("100");

    component.getPriceModelPicker().contains("STATIC").click();

    component.endDateTester.getDatePicker();
    component.endDateTester.nextMonth();
    component.endDateTester.pickFirstDayOfMonth();
    component.endDateTester.pickTime();
    component.endDateTester.confirm();

    component.getConfirmButton().click();

    component
      .getSubmitDeployButton()
      .click()
      .then(() => {
        const calledWith = onSubmitSpy.getCall(0).args[0] as typeof target;

        expect(calledWith.priceModel).to.equal("static");
      });
  });
});

const target = {
  quoteToken: {
    id: "dai",
    key: "dai",
    name: "DAI",
    symbol: "DAI",
    logoUrl:
      "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/DAI.png",
    icon: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/DAI.png",
    addresses: {
      "1": "0x6b175474e89094c44da98b954eedeac495271d0f",
      "5": [
        "0x2899a03ffdab5c90badc5920b4f53b0884eb13cc",
        "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
      ],
      "10": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
      "56": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      "137": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      "250": "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
      "420": [
        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        "0xeac3ec0cc130f4826715187805d1b50e861f2dac",
      ],
      "42161": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      "43113": "0x69da0a4ace14c0befe906f18881a35670e7568ac",
      "43114": "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
      "80001": "0x0A516075c186a821DAAc20D77fBB78b2dacCD681",
      "421613": "0xcA93c9BFaC39efC5b069066a0970c3036C3029c9",
    },
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    chainId: 1,
    apiId: "dai",
    price: 1,
    priceSources: [
      {
        source: "coingecko",
        apiId: "dai",
      },
    ],
    decimals: 18,
  },
  payoutToken: {
    id: "olympus",
    key: "olympus",
    name: "Olympus",
    symbol: "OHM",
    logoUrl:
      "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/OLYMPUSDAO.png",
    icon: "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/OLYMPUSDAO.png",
    addresses: {
      "1": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
      "5": "0x0595328847af962f951a4f8f8ee9a3bf261e4f6b",
      "420": "0x8f6406edbfa393e327822d4a08bcf15503570d87",
      "43113": "0x093b7d9cf240339b851287c8c7ae2fa78232f9ee",
      "80001": "0x7C618760C9fc018e3d3681f888aB0cD4568C26cc",
      "421613": "0x6Cec0Ba158fd0C8BC48eafa11f8560318B32258D",
    },
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    chainId: 1,
    apiId: "olympus",
    price: 10.27,
    priceSources: [
      {
        source: "coingecko",
        apiId: "olympus",
      },
    ],
    decimals: 18,
  },
  capacityType: "payout",
  capacity: "100",
  allowance: "10000000",
  recommendedAllowance: "100",
  recommendedAllowanceDecimalAdjusted: "100000000000000000000",
  isAllowanceSufficient: true,
  vesting: "604800",
  vestingType: "term",
  vestingString: "7 DAYS",
  priceModel: "dynamic",
  oracleAddress: "",
  bondsPerWeek: 7,
  maxBondSize: 2.17,
  debtBuffer: 35,
  depositInterval: 86400,
  priceModels: {
    dynamic: {
      initialPrice: 10.27,
      minPrice: 10.27,
    },
    static: {},
    "oracle-dynamic": {},
    "oracle-static": {},
  },
  oracle: false,
};
