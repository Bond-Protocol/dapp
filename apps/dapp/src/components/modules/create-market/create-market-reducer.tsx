import { calculateTrimDigits, trimAsNumber, formatDate } from "formatters";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { differenceInCalendarDays } from "date-fns";
import { formatUnits, parseUnits } from "viem";
import { switchNetwork } from "@wagmi/core";
import { unavailableOracleChains } from "./config";

const DEFAULT_DEPOSIT_INTERVAL = 86400;
const DEFAULT_DEBT_BUFFER = 75;

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
  logoUrl?: string;
  logoURI?: string;
  addresses?: { [key: string | number]: string | string[] };
  address?: string;
  apiId?: string;
};

export enum CreateMarketAction {
  UPDATE_CHAIN_ID = "update_chain_id",
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
  OVERRIDE_MAX_BOND_SIZE = "override_max_bond_size",
  OVERRIDE_DEPOSIT_INTERVAL = "override_deposit_interval",
  OVERRIDE_DEBT_BUFFER = "override_debt_buffer",
}

export type PriceModelConfig = {
  reversedRate?: boolean;
  [key: string]: any;
};

type OverridableCreateMarketParams = {
  maxBondSize: number;
  debtBuffer: number;
  depositInterval: number;
};

export type CreateMarketState = OverridableCreateMarketParams & {
  quoteToken: Token;
  payoutToken: Token;
  capacityType: CapacityOption;
  capacity: string;
  allowance: bigint;
  recommendedAllowance: string;
  recommendedAllowanceDecimalAdjusted: bigint;
  isAllowanceSufficient: boolean;
  vesting: string;
  vestingType: VestingType;
  vestingString: string;
  priceModel: PriceModel;
  priceModels: Record<PriceModel, PriceModelConfig>;
  startDate?: Date;
  endDate?: Date;
  oracleAddress?: string;
  oracle?: boolean;
  duration: string;
  durationInDays: number;
  fixedDiscount?: number;
  maxDiscountFromCurrent?: number;
  baseDiscount?: number;
  targetIntervalDiscount?: number;
  overridden: boolean;
  chainId: number;
};

const placeholderToken = {
  name: "",
  symbol: "",
  icon: "",
  price: 0,
  decimals: 18,
};

export const placeholderState: CreateMarketState = {
  quoteToken: placeholderToken,
  payoutToken: placeholderToken,
  chainId: 1,
  capacityType: "payout" as CapacityOption,
  capacity: "",
  allowance: 0n,
  recommendedAllowance: "",
  recommendedAllowanceDecimalAdjusted: 0n,
  isAllowanceSufficient: false,
  vesting: "",
  vestingType: "term",
  vestingString: "",
  priceModel: "dynamic" as PriceModel,
  oracleAddress: "",
  maxBondSize: 0,
  debtBuffer: DEFAULT_DEBT_BUFFER,
  depositInterval: DEFAULT_DEPOSIT_INTERVAL,
  duration: "",
  durationInDays: 0,
  priceModels: {
    dynamic: {},
    static: {},
    "oracle-dynamic": {},
    "oracle-static": {},
  },
  overridden: false,
};

export const calculateDebtBuffer = (
  marketDurationInDays: number,
  depositInterval: number,
  capacity: number
) => {
  const duration = marketDurationInDays * 24 * 60 * 60;
  const decayInterval = Math.max(5 * depositInterval, 3 * 24 * 24 * 60);
  return Math.round(
    ((capacity * 0.25) / ((capacity * decayInterval) / duration)) * 100
  );
};

export function calculateDuration(endDate?: Date, startDate?: Date) {
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

function calculateDurationAndMaxBondSize(
  endDate?: Date,
  startDate?: Date,
  capacity?: string
) {
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
  allowance: bigint
) {
  if (
    !payoutToken ||
    (!payoutToken.price && capacityType === "quote") ||
    !payoutToken.decimals ||
    !quoteToken ||
    (!quoteToken.price && capacityType === "quote") ||
    !quoteToken.decimals ||
    !capacity ||
    !capacityType
  ) {
    return {
      recommendedAllowance: "",
      recommendedAllowanceDecimalAdjusted: 0n,
      isAllowanceSufficient: false,
    };
  }

  const recommendedAllowance =
    capacityType === "quote"
      ? Number(capacity) / (payoutToken.price / quoteToken.price)
      : capacity;

  const form = parseUnits(
    recommendedAllowance.toString(),
    payoutToken.decimals
  );

  const matcher = /\.|,/g;
  const rec = (
    Number(recommendedAllowance) * Math.pow(10, payoutToken.decimals)
  )
    .toLocaleString()
    .replaceAll(matcher, "");

  let recommendedAllowanceDecimalAdjusted = BigInt(
    rec.split(".")[0]
  ).toString();

  recommendedAllowanceDecimalAdjusted =
    recommendedAllowanceDecimalAdjusted.split(".")[0];

  const isAllowanceSufficient = Number(form) <= Number(allowance);

  return {
    recommendedAllowance: recommendedAllowance.toString(),
    recommendedAllowanceDecimalAdjusted: form,
    isAllowanceSufficient,
  };
}

const tweakDebtBuffer = (state: CreateMarketState) => {
  const days =
    differenceInCalendarDays(
      state.endDate as Date,
      state.startDate ?? new Date()
    ) + 1; //TODO: The previous version adds a day to the difference (V1-L290)

  const capacity = parseFloat(state.capacity);

  return calculateDebtBuffer(days, state.depositInterval, capacity);
};

export const reducer = (
  state: CreateMarketState,
  action: { type: CreateMarketAction; [key: string]: any }
): CreateMarketState => {
  const { type, value } = action;

  console.log(type);
  switch (type) {
    case CreateMarketAction.UPDATE_CHAIN_ID: {
      const chainId = Number(value);
      if (isNaN(chainId)) return state;
      if (chainId === state.chainId) return state;

      switchNetwork({ chainId });

      const oracleUnavailable = unavailableOracleChains.includes(chainId);

      return {
        ...state,
        chainId,
        payoutToken: placeholderToken,
        quoteToken: placeholderToken,
        oracle: !oracleUnavailable && state.oracle,
        priceModel: oracleUnavailable ? "dynamic" : state.priceModel,
      };
    }

    case CreateMarketAction.UPDATE_QUOTE_TOKEN: {
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

    case CreateMarketAction.UPDATE_PAYOUT_TOKEN: {
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

    case CreateMarketAction.UPDATE_ALLOWANCE: {
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

    case CreateMarketAction.UPDATE_CAPACITY: {
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

      const debtBuffer = tweakDebtBuffer({ ...state, capacity });

      return {
        ...state,
        capacity,
        maxBondSize,
        recommendedAllowance,
        recommendedAllowanceDecimalAdjusted,
        isAllowanceSufficient,
        debtBuffer,
      };
    }

    case CreateMarketAction.UPDATE_CAPACITY_TYPE: {
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

    case CreateMarketAction.UPDATE_VESTING: {
      let vesting: string = "";
      let vestingString: string = "";

      if (value.type === "term") {
        vesting = (parseFloat(value.value) * 24 * 60 * 60).toString();
        vestingString = parseFloat(value.value) + " DAYS";
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

    case CreateMarketAction.UPDATE_START_DATE: {
      const { duration, durationInDays, maxBondSize } =
        calculateDurationAndMaxBondSize(state.endDate, value, state.capacity);

      const debtBuffer = tweakDebtBuffer({ ...state, startDate: value });

      return {
        ...state,
        startDate: value,
        duration: duration ? duration.toString() : "",
        durationInDays,
        maxBondSize,
        debtBuffer,
      };
    }

    case CreateMarketAction.UPDATE_END_DATE: {
      const { duration, durationInDays, maxBondSize } =
        calculateDurationAndMaxBondSize(value, state.startDate, state.capacity);

      const debtBuffer = tweakDebtBuffer({ ...state, endDate: value });

      return {
        ...state,
        endDate: value,
        duration: duration ? duration.toString() : "",
        durationInDays,
        maxBondSize,
        debtBuffer,
      };
    }

    case CreateMarketAction.UPDATE_PRICE_MODEL: {
      const { priceModel, oracle, oracleAddress } = value;

      return {
        ...state,
        priceModel,
        oracle,
        oracleAddress: oracle ? oracleAddress : "",
      };
    }

    case CreateMarketAction.UPDATE_PRICE_RATES: {
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

    case CreateMarketAction.OVERRIDE_MAX_BOND_SIZE: {
      const depositInterval = Math.trunc(
        Number(state.duration) / (Number(state.capacity) / value)
      );

      const debtBuffer = tweakDebtBuffer({ ...state, depositInterval });

      return {
        ...state,
        depositInterval,
        debtBuffer,
        maxBondSize: value,
      };
    }

    case CreateMarketAction.OVERRIDE_DEPOSIT_INTERVAL: {
      // Value provided in hours, we save it as seconds
      const depositInterval = value * 60 * 60;
      const debtBuffer = tweakDebtBuffer({ ...state, depositInterval });
      let maxBondSize =
        (Number(state.capacity) * depositInterval) / Number(state.duration);
      maxBondSize = trimAsNumber(maxBondSize, calculateTrimDigits(maxBondSize));

      return {
        ...state,
        maxBondSize,
        depositInterval,
        debtBuffer,
        overridden: true,
      };
    }

    case CreateMarketAction.OVERRIDE_DEBT_BUFFER: {
      return {
        ...state,
        debtBuffer: value,
        overridden: true,
      };
    }

    case CreateMarketAction.RESET: {
      return placeholderState;
    }

    default: {
      return state;
    }
  }
};

export const CreateMarketContext = createContext<
  [
    CreateMarketState,
    Dispatch<{ [key: string]: any; type: CreateMarketAction }>
  ]
>([placeholderState, () => null]);

export const CreateMarketProvider = ({
  children,
  initialState = placeholderState,
}: {
  children: React.ReactNode;
  initialState?: CreateMarketState;
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
