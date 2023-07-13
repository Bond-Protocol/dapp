import { createContext, Dispatch, useContext, useReducer } from "react";
import type { Token } from "ui";

export enum CreateAuctionAction {
  UPDATE_QUOTE_TOKEN = "update_quote_token",
  UPDATE_PAYOUT_TOKEN = "update_payout_token",
  UPDATE_CAPACITY = "update_capacity",
  UPDATE_FUNDING_THRESHOLD = "update_funding_threshold",
  UPDATE_MIN_PRICE = "update_min_price",
  UPDATE_START_DATE = "update_start_date",
  UPDATE_END_DATE = "update_end_date",
  UPDATE_MIN_BID = "update_min_bid",
  UPDATE_LAST_CANCEL = "update_last_cancel",
  UPDATE_CHAIN_ID = "update_chain_id",
}

export interface CreateAuctionState {
  quoteToken: Token;
  payoutToken: Token;
  capacity: number;
  fundingThreshold: number;
  minPrice: number;
  startDate: Date;
  endDate: Date;
  minBid: number;
  lastCancel: Date;
  chainId: number;
}

export const createAuctionReducer = (
  state: CreateAuctionState,
  action: { type: CreateAuctionAction; value: any }
): CreateAuctionState => {
  const { type, value } = action;

  console.log({ type, value, prevState: state });
  switch (type) {
    case CreateAuctionAction.UPDATE_QUOTE_TOKEN: {
      return { ...state, quoteToken: value };
    }

    case CreateAuctionAction.UPDATE_PAYOUT_TOKEN: {
      return { ...state, payoutToken: value };
    }

    case CreateAuctionAction.UPDATE_CHAIN_ID: {
      return { ...state, chainId: Number(value) };
    }

    case CreateAuctionAction.UPDATE_CAPACITY: {
      return { ...state, capacity: Number(value) };
    }

    case CreateAuctionAction.UPDATE_FUNDING_THRESHOLD: {
      return { ...state, fundingThreshold: Number(value) };
    }

    case CreateAuctionAction.UPDATE_MIN_PRICE: {
      return { ...state, minPrice: Number(value) };
    }

    case CreateAuctionAction.UPDATE_START_DATE: {
      return { ...state, startDate: value };
    }

    case CreateAuctionAction.UPDATE_END_DATE: {
      return { ...state, endDate: value };
    }

    case CreateAuctionAction.UPDATE_MIN_BID: {
      return { ...state, minBid: value };
    }

    case CreateAuctionAction.UPDATE_LAST_CANCEL: {
      return { ...state, lastCancel: value };
    }

    default: {
      return state;
    }
  }
};

export const placeholderState = {
  quoteToken: {},
  payoutToken: {},
  capacity: 0,
  fundingThreshold: 0,
  minPrice: 0,
  endDate: new Date(),
  startDate: new Date(),
  minBid: 0,
  lastCancel: new Date(),
} as CreateAuctionState;

export const CreateAuctionContext = createContext<
  [
    CreateAuctionState,
    Dispatch<{ [key: string]: any; type: CreateAuctionAction }>
  ]
>([placeholderState, () => null]);

export const CreateAuctionProvider = ({
  children,
  initialState = placeholderState,
}: {
  children: React.ReactNode;
  initialState?: CreateAuctionState;
}) => {
  const stateControls = useReducer(createAuctionReducer, initialState);

  return (
    //@ts-ignore
    <CreateAuctionContext.Provider value={stateControls}>
      {children}
    </CreateAuctionContext.Provider>
  );
};

export const useCreateAuction = () => {
  return useContext(CreateAuctionContext);
};
