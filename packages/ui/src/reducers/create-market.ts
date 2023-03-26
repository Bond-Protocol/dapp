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
}

type Token = Object & {
  name: string;
  symbol: string;
  icon: string;
};

type CapacityType = "quote" | "payout";

export type CreateMarketState = {
  quoteToken: Token;
  payoutToken: Token;
  capacityToken: Token;
  capacityType: CapacityType;
  capacity: string;
  vesting: "term" | "expiry";
  vestingDate: number;
  priceModel: PriceModel;
  priceModels: Record<PriceModel, any>;
  oracleAddress?: string;
  startDate?: Date;
};

const emptyToken = {
  name: "",
  symbol: "",
  icon: "",
};

const initialState: CreateMarketState = {
  quoteToken: emptyToken,
  payoutToken: emptyToken,
  capacityToken: emptyToken,
  capacityType: "payout" as CapacityType,
  capacity: "0",
  vesting: "term",
  vestingDate: 0,
  priceModel: "dynamic" as PriceModel,
  oracleAddress: "",
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
) {
  const { type, ...args } = action;

  switch (type) {
    case Action.UPDATE_QUOTE_TOKEN: {
      return { ...state, quoteToken: args.value };
    }

    case Action.UPDATE_PAYOUT_TOKEN: {
      return { ...state, payoutToken: args.value };
    }

    case Action.UPDATE_CAPACITY: {
      return {
        ...state,
        capacity: args.value,
      };
    }

    case Action.UPDATE_CAPACITY_TYPE: {
      return {
        ...state,
        capacityType: args.value,
      };
    }

    case Action.UPDATE_VESTING: {
      return { ...state, vesting: args.value };
    }

    case Action.UPDATE_PRICE_MODEL: {
      return {
        ...state,
        type: args.type,
        oracle: !!args.oracle,
        oracleAddress: args.address,
      };
    }

    case Action.UPDATE_PRICE_RATES: {
      const { priceModel, ...rates } = args.value;

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

    default: {
      return state;
    }
  }
}

export const useCreateMarket = (init = (state: CreateMarketState) => state) => {
  return useReducer(reducer, initialState, init);
};
