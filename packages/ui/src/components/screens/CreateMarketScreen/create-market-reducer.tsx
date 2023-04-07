import { calculateTrimDigits, trimAsNumber } from "utils/trim";
import { formatDate } from "utils";
import { useReducer, useContext, createContext, Dispatch } from "react";

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
  address?: string;
  apiId?: string;
};

export enum Action {
  UPDATE_QUOTE_TOKEN = "update_bond_token",
  UPDATE_PAYOUT_TOKEN = "update_payout_token",
  UPDATE_CAPACITY_TYPE = "update_capacity_type",
  UPDATE_CAPACITY = "update_capacity",
  UPDATE_ALLOWANCE = "update_allowance",
  UPDATE_VESTING = "update_vesting",
  UPDATE_PRICE_MODEL = "update_price_model",
  UPDATE_PRICE_RATES = "update_price_rates",
  UPDATE_START_DATE = "update_start_date",
  UPDATE_END_DATE = "update_end_date",
  RESET = "reset",
}

export type PriceModelConfig = {
  reversedRate?: boolean;
  [key: string]: any;
};

export type CreateMarketState = {
  quoteToken: Token;
  payoutToken: Token;
  capacityType: CapacityOption;
  capacity: string;
  allowance: string;
  recommendedAllowance: string;
  recommendedAllowanceDecimalAdjusted: string;
  isAllowanceSufficient: boolean;
  vesting: string;
  vestingType: VestingType;
  vestingString: string;
  bondsPerWeek: number;
  priceModel: PriceModel;
  priceModels: Record<PriceModel, PriceModelConfig>;
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
  allowance: "",
  recommendedAllowance: "",
  recommendedAllowanceDecimalAdjusted: "",
  isAllowanceSufficient: false,
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
    duration = endDate.getTime() / 1000 - startDate.getTime() / 1000;
  } else if (endDate) {
    duration = endDate.getTime() / 1000 - Date.now() / 1000;
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
    maxBondSize,
  };
}

function calculateAllowance(
  payoutToken: Token,
  quoteToken: Token,
  capacity: string,
  capacityType: string,
  allowance: string
) {
  if (
    !payoutToken ||
    !payoutToken.price ||
    !payoutToken.decimals ||
    !quoteToken ||
    !quoteToken.price ||
    !quoteToken.decimals ||
    !capacity ||
    !capacityType
  ) {
    return {
      recommendedAllowance: "",
      recommendedAllowanceDecimalAdjusted: "",
      isAllowanceSufficient: false,
    };
  }

  const recommendedAllowance =
    capacityType === "quote"
      ? Number(capacity) / (payoutToken.price / quoteToken.price)
      : capacity;

  const rec = (
    Number(recommendedAllowance) * Math.pow(10, payoutToken.decimals)
  ).toString();

  let recommendedAllowanceDecimalAdjusted = BigInt(
    rec.split(".")[0]
  ).toString();

  recommendedAllowanceDecimalAdjusted =
    recommendedAllowanceDecimalAdjusted.split(".")[0];

  const isAllowanceSufficient =
    Number(recommendedAllowance) <= Number(allowance);

  return {
    recommendedAllowance: recommendedAllowance.toString(),
    recommendedAllowanceDecimalAdjusted,
    isAllowanceSufficient,
  };
}

export const reducer = (
  state: CreateMarketState,
  action: { type: Action; [key: string]: any }
): CreateMarketState => {
  const { type, value } = action;

  console.log({ type, value });

  switch (type) {
    case Action.UPDATE_QUOTE_TOKEN: {
      const {
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      } = calculateAllowance(
        state.payoutToken,
        value,
        state.capacity,
        state.capacityType,
        state.allowance
      );

      return {
        ...state,
        quoteToken: value,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      };
    }

    case Action.UPDATE_PAYOUT_TOKEN: {
      const {
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      } = calculateAllowance(
        value,
        state.quoteToken,
        state.capacity,
        state.capacityType,
        state.allowance
      );

      return {
        ...state,
        payoutToken: value,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      };
    }

    case Action.UPDATE_ALLOWANCE: {
      const {
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      } = calculateAllowance(
        state.payoutToken,
        state.quoteToken,
        state.capacity,
        state.capacityType,
        value
      );

      return {
        ...state,
        allowance: value,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      };
    }

    case Action.UPDATE_CAPACITY: {
      const capacity = isNaN(Number(value)) ? "" : value;

      let maxBondSize = 0;
      if (state.durationInDays) {
        maxBondSize = calculateMaxBondSize(capacity, state.durationInDays);
      }

      const {
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      } = calculateAllowance(
        state.payoutToken,
        state.quoteToken,
        capacity,
        state.capacityType,
        state.allowance
      );

      return {
        ...state,
        capacity,
        maxBondSize,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      };
    }

    case Action.UPDATE_CAPACITY_TYPE: {
      const {
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      } = calculateAllowance(
        state.payoutToken,
        state.quoteToken,
        state.capacity,
        value,
        state.allowance
      );

      return {
        ...state,
        capacityType: value,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
      };
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
        vestingType: value.type,
      };
    }

    case Action.UPDATE_START_DATE: {
      const { duration, durationInDays, maxBondSize } = onChangeDate(
        state.endDate,
        value,
        state.capacity
      );

      return {
        ...state,
        startDate: value,
        duration: duration ? duration.toString() : "",
        durationInDays,
        maxBondSize,
      };
    }

    case Action.UPDATE_END_DATE: {
      const { duration, durationInDays, maxBondSize } = onChangeDate(
        value,
        state.startDate,
        state.capacity
      );

      return {
        ...state,
        endDate: value,
        duration: duration ? duration.toString() : "",
        durationInDays,
        maxBondSize,
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

export const CreateMarketContext = createContext<
  [CreateMarketState, Dispatch<{ [key: string]: any; type: Action }>]
>([initialState, () => null]);

export const CreateMarketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const stateControls = useReducer(reducer, initialState);
  return (
    <CreateMarketContext.Provider value={stateControls}>
      {children}
    </CreateMarketContext.Provider>
  );
};

export const useCreateMarket = () => {
  return useContext(CreateMarketContext);
};
