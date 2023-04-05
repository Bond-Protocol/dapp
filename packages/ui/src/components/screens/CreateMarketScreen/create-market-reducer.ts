import { useReducer } from "react";
import {
  calculateTrimDigits,
  trim, trimAsNumber,
} from "@bond-protocol/contract-library";
import { formatDate } from "utils";

export type PriceType = "dynamic" | "static";
export type PriceModel = PriceType | "oracle-dynamic" | "oracle-static";
export type CapacityOption = "quote" | "payout";
export type VestingType = "term" | "date";

export type Token = {
  name: string;
  symbol: string;
  icon: string;
  price: number;
  decimals: number;
  addresses?: { [key: string | number]: string | string[] };
};

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

export type CreateMarketState = {
  quoteToken: Token;
  payoutToken: Token;
  capacityType: CapacityOption;
  capacity: string;
  vesting: string;
  vestingType: VestingType;
  vestingString: string;
  bondsPerWeek: number;
  priceModel: PriceModel;
  priceModels: Record<PriceModel, any>;
  startDate?: Date;
  endDate?: Date;
  oracleAddress?: string;
  oracle?: boolean;
  maxBondSize?: number;
  debtBuffer?: number;
  depositInterval?: number;
  duration: string;
  durationInDays: number;
};

const placeholderToken = {
  name: "",
  symbol: "",
  icon: "",
  price: 0,
  decimals: 18,
};

const initialState: CreateMarketState = {
  quoteToken: placeholderToken,
  payoutToken: placeholderToken,
  capacityType: "payout" as CapacityOption,
  capacity: "",
  vesting: "",
  vestingType: "term",
  vestingString: "",
  priceModel: "dynamic" as PriceModel,
  oracleAddress: "",
  bondsPerWeek: 7,
  maxBondSize: 0,
  debtBuffer: 45,
  depositInterval: 24,
  duration: "",
  durationInDays: 0,
  priceModels: {
    dynamic: {},
    static: {},
    "oracle-dynamic": {},
    "oracle-static": {},
  },
};

function calculateDuration(endDate?: Date, startDate?: Date) {
  let duration;
  if (endDate && startDate) {
    duration =
      endDate.getTime() / 1000 - startDate.getTime() / 1000;
  } else if (endDate) {
    duration = (endDate.getTime() / 1000) -  (Date.now() / 1000);
  }
  return duration && duration.toFixed(0);
}

function calculateMaxBondSize(capacity: string, durationInDays: number) {
  const maxBondSize = Number(capacity) / durationInDays;
  return trimAsNumber(maxBondSize, calculateTrimDigits(maxBondSize));
}

function onChangeDate(endDate?: Date, startDate?: Date, capacity?: string) {
  const duration = calculateDuration(endDate, startDate);
  const durationInDays = Math.ceil(Number(duration) / 60 / 60 / 24);

  let maxBondSize = 0;
  if (capacity) {
    maxBondSize = calculateMaxBondSize(capacity, durationInDays);
  }

  return {
    duration,
    durationInDays,
    maxBondSize
  }
}

export const reducer = (
  state: CreateMarketState,
  action: { type: Action; [key: string]: any }
): CreateMarketState => {
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

      let maxBondSize = 0;
      if (state.durationInDays) {
        maxBondSize = calculateMaxBondSize(capacity, state.durationInDays);
      }

      return {
        ...state,
        capacity,
        maxBondSize
      };
    }

    case Action.UPDATE_CAPACITY_TYPE: {
      return { ...state, capacityType: value };
    }

    case Action.UPDATE_VESTING: {
      let vesting: string = "";
      let vestingString: string = "";

      if (value.type === "term") {
        vesting = (value.value * 24 * 60 * 60).toString();
        vestingString = value.value + " DAYS";
      } else if (value.type === "date") {
        vesting = (value.value.getTime() / 1000).toString();
        vestingString = formatDate.short(value.value as Date);
      }

      return {
        ...state,
        vesting,
        vestingString,
        vestingType: value.type
      };
    }

    case Action.UPDATE_START_DATE: {
      const {
        duration,
        durationInDays,
        maxBondSize
      } = onChangeDate(state.endDate, value, state.capacity);

      return {
        ...state,
        startDate: value,
        duration: duration
          ? duration.toString()
          : "",
        durationInDays,
        maxBondSize
      };
    }

    case Action.UPDATE_END_DATE: {
      const {
        duration,
        durationInDays,
        maxBondSize
      } = onChangeDate(value, state.startDate, state.capacity);

      return {
        ...state,
        endDate: value,
        duration: duration
          ? duration.toString()
          : "",
        durationInDays,
        maxBondSize
      };
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
};

export const useCreateMarket = (init = (state: CreateMarketState) => state) => {
  return useReducer(reducer, initialState, init);
};
