import { useReducer } from "react";

export type PriceType = "dynamic" | "static";
export type PriceModel = PriceType | "oracle-dynamic" | "oracle-static";

export enum Action {
  UPDATE_QUOTE_TOKEN = "update_bond_token",
  UPDATE_PAYOUT_TOKEN = "update_payout_token",
  UPDATE_CAPACITY_TYPE = "update_capacity_type",
  UPDATE_CAPACITY = "update_capacity",
  UPDATE_VESTING = "update_vesting",
  UPDATE_PRICE_MODEL = "update_price_model",
  UPDATE_PRICE_RATES = "update_price_rates",
  UPDATE_START_DATE = "update_start_date",
  UPDATE_END_DATE = "update_end_date",
  RESET = "reset",
}

export type Token = {
  name: string;
  symbol: string;
  icon: string;
  price: number;
  decimals: number;
  addresses?: { [key: string | number]: string | string[] };
};

type CapacityType = "quote" | "payout";

export type CreateMarketState = {
  quoteToken: Token;
  payoutToken: Token;
  capacityType: CapacityType;
  capacity: string;
  vesting: "term" | "expiry";
  vestingDate: string;
  bondsPerWeek: number;
  priceModel: PriceModel;
  priceModels: Record<PriceModel, any>;
  startDate: Date;
  endDate: Date;
  oracleAddress?: string;
  oracle?: boolean;
};

const emptyToken = {
  name: "",
  symbol: "",
  icon: "",
  price: 0,
  decimals: 18,
};

const initialState: CreateMarketState = {
  quoteToken: emptyToken,
  payoutToken: emptyToken,
  capacityType: "payout" as CapacityType,
  capacity: "",
  vesting: "term",
  vestingDate: "7",
  priceModel: "dynamic" as PriceModel,
  oracleAddress: "",
  endDate: new Date(),
  bondsPerWeek: 7,
  startDate: new Date(),
  priceModels: {
    dynamic: {},
    static: {},
    "oracle-dynamic": {},
    "oracle-static": {},
  },
};

export function reducer(
  state: CreateMarketState,
  action: { type: Action; [key: string]: any }
): CreateMarketState {
  const { type, value } = action;

  console.log({ type, value });

  switch (type) {
    case Action.UPDATE_QUOTE_TOKEN: {
      return { ...state, quoteToken: value };
    }

    case Action.UPDATE_PAYOUT_TOKEN: {
      return { ...state, payoutToken: value };
    }

    case Action.UPDATE_CAPACITY: {
      const capacity = isNaN(Number(value)) ? "" : value;

      return { ...state, capacity };
    }

    case Action.UPDATE_CAPACITY_TYPE: {
      return { ...state, capacityType: value };
    }

    case Action.UPDATE_VESTING: {
      return { ...state, vesting: value };
    }

    case Action.UPDATE_START_DATE: {
      return { ...state, startDate: value };
    }

    case Action.UPDATE_END_DATE: {
      return { ...state, endDate: value };
    }

    case Action.UPDATE_PRICE_MODEL: {
      const { priceModel, oracle, oracleAddress } = value;

      return {
        ...state,
        priceModel,
        oracle,
        oracleAddress,
      };
    }

    case Action.UPDATE_PRICE_RATES: {
      const { priceModel, ...rates } = value;

      return {
        ...state,
        priceModels: {
          ...state.priceModels,
          [priceModel]: {
            ...(state.priceModels[priceModel as PriceModel] ?? {}),
            ...rates,
          },
        },
      };
    }

    case Action.RESET: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const useCreateMarket = (init = (state: CreateMarketState) => state) => {
  return useReducer(reducer, initialState, init);
};
