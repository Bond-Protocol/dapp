import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
    namespace Schemas {
        /**
         * A JSON object containing two string fields, access_token and refresh_token.
         */
        export interface JWTPair {
            /**
             * A JWT refresh token
             */
            refresh_token?: string;
            /**
             * A JWT access token
             */
            access_token?: string;
        }
        /**
         * Details of an existing order.
         */
        export interface Order {
            /**
             * The id of the market an order is being placed for.
             */
            market_id?: string;
            /**
             * The address which will receive the purchased tokens.
             */
            recipient?: string;
            /**
             * The address which will receive the referral fee.
             */
            referrer?: string;
            /**
             * The amount of tokens to purchase.
             */
            amount?: string;
            /**
             * The minimum number of tokens the recipient is willing to receive.
             */
            min_amount_out?: string;
            /**
             * The maximum fee the recipient will pay.
             */
            max_fee?: string;
            /**
             * Timestamp at which the order was submitted.
             */
            submitted?: string;
            /**
             * Timestamp at which the order expires.
             */
            deadline?: string;
            /**
             * Address of the user who submitted the order.
             */
            user?: string;
        }
        /**
         * Parameters for an order, including a signature.
         */
        export interface OrderRequest {
            /**
             * The id of the market an order is being placed for.
             */
            market_id?: string;
            /**
             * The address which will receive the purchased tokens.
             */
            recipient?: string;
            /**
             * The address which will receive the referral fee.
             */
            referrer?: string;
            /**
             * The amount of tokens to purchase.
             */
            amount?: string;
            /**
             * The minimum number of tokens the recipient is willing to receive.
             */
            min_amount_out?: string;
            /**
             * The maximum fee the recipient will pay.
             */
            max_fee?: string;
            /**
             * Timestamp at which the order was submitted.
             */
            submitted?: string;
            /**
             * Timestamp at which the order expires.
             */
            deadline?: string;
            /**
             * Address of the user who submitted the order.
             */
            user?: string;
            /**
             * Signature for a tx containing the same order data.
             */
            signature?: string;
        }
        /**
         * A JSON object containing two string fields, a Sign in With Ethereum message and signature. The nonce found in the decoded signature should match the nonce in the message.
         */
        export interface SigninData {
            /**
             * The messaged use with SIWE
             */
            message?: string;
            /**
             * The SIWE Signature
             */
            signature?: string;
        }
    }
}
declare namespace Paths {
    namespace CreateOrder {
        export type RequestBody = /* Parameters for an order, including a signature. */ Components.Schemas.OrderRequest;
        namespace Responses {
            export type $200 = string;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace EstimateFee {
        export type RequestBody = /* Details of an existing order. */ Components.Schemas.Order;
        namespace Responses {
            export type $200 = number;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace FeesEstimate {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
    }
    namespace GetActiveOrdersByAddress {
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
            export interface $500 {
            }
        }
    }
    namespace GetExecutors {
        namespace Responses {
            export type $200 = string[];
            export interface $500 {
            }
        }
    }
    namespace GetNonce {
        namespace Responses {
            export type $200 = string;
            export interface $500 {
            }
        }
    }
    namespace GetOrdersByAddress {
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
            export interface $500 {
            }
        }
    }
    namespace GetSupportedQuoteTokens {
        namespace Responses {
            export type $200 = string[];
            export interface $500 {
            }
        }
    }
    namespace IsTokenSupported {
        namespace Responses {
            export type $200 = boolean;
            export interface $500 {
            }
        }
    }
    namespace OrdersAddress$Address {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
        }
    }
    namespace OrdersAddress$AddressActive {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
        }
    }
    namespace OrdersNew {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
    }
    namespace PermissionsExecutors {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
    }
    namespace QuoteTokens {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
    }
    namespace QuoteTokens$Address {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
        }
    }
    namespace RefreshAuth {
        export type RequestBody = string;
        namespace Responses {
            export type $200 = /* A JSON object containing two string fields, access_token and refresh_token. */ Components.Schemas.JWTPair;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace SignIn {
        export type RequestBody = /* A JSON object containing two string fields, a Sign in With Ethereum message and signature. The nonce found in the decoded signature should match the nonce in the message. */ Components.Schemas.SigninData;
        namespace Responses {
            export type $200 = /* A JSON object containing two string fields, access_token and refresh_token. */ Components.Schemas.JWTPair;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace TestAuth {
        namespace Responses {
            export type $200 = string;
            export interface $401 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * getNonce - Get a nonce for a sign in request.
   */
  'getNonce'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetNonce.Responses.$200>
  /**
   * signIn - Signs the user in, creating and returning a JWT.
   */
  'signIn'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.SignIn.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.SignIn.Responses.$200>
  /**
   * refreshAuth - Checks a provided refresh token, returns a new access token and refresh token.
   */
  'refreshAuth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.RefreshAuth.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RefreshAuth.Responses.$200>
  /**
   * testAuth - Tests whether signed in user can view address provided in params.
   */
  'testAuth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TestAuth.Responses.$200>
  /**
   * estimateFee - Estimates fees for an Order
   */
  'estimateFee'(
    parameters?: Parameters<Paths.FeesEstimate.HeaderParameters> | null,
    data?: Paths.EstimateFee.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.EstimateFee.Responses.$200>
  /**
   * createOrder - Submit a new order.
   */
  'createOrder'(
    parameters?: Parameters<Paths.OrdersNew.HeaderParameters> | null,
    data?: Paths.CreateOrder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOrder.Responses.$200>
  /**
   * getOrdersByAddress - Get Orders for user address.
   */
  'getOrdersByAddress'(
    parameters?: Parameters<Paths.OrdersAddress$Address.PathParameters & Paths.OrdersAddress$Address.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOrdersByAddress.Responses.$200>
  /**
   * getActiveOrdersByAddress - Get active Orders for user address.
   */
  'getActiveOrdersByAddress'(
    parameters?: Parameters<Paths.OrdersAddress$AddressActive.PathParameters & Paths.OrdersAddress$AddressActive.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetActiveOrdersByAddress.Responses.$200>
  /**
   * getExecutors - Get addresses with executor permissions.
   */
  'getExecutors'(
    parameters?: Parameters<Paths.PermissionsExecutors.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetExecutors.Responses.$200>
  /**
   * getSupportedQuoteTokens - Returns all quote tokens on the chain specified in the X-Chain_Id header
   */
  'getSupportedQuoteTokens'(
    parameters?: Parameters<Paths.QuoteTokens.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSupportedQuoteTokens.Responses.$200>
  /**
   * isTokenSupported - Checks whether the specified quote token is approved.
   */
  'isTokenSupported'(
    parameters?: Parameters<Paths.QuoteTokens$Address.PathParameters & Paths.QuoteTokens$Address.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.IsTokenSupported.Responses.$200>
}

export interface PathsDictionary {
  ['/auth/nonce']: {
    /**
     * getNonce - Get a nonce for a sign in request.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetNonce.Responses.$200>
  }
  ['/auth/sign_in']: {
    /**
     * signIn - Signs the user in, creating and returning a JWT.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.SignIn.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.SignIn.Responses.$200>
  }
  ['/auth/refresh']: {
    /**
     * refreshAuth - Checks a provided refresh token, returns a new access token and refresh token.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.RefreshAuth.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RefreshAuth.Responses.$200>
  }
  ['/auth/test']: {
    /**
     * testAuth - Tests whether signed in user can view address provided in params.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TestAuth.Responses.$200>
  }
  ['/fees/estimate']: {
    /**
     * estimateFee - Estimates fees for an Order
     */
    'get'(
      parameters?: Parameters<Paths.FeesEstimate.HeaderParameters> | null,
      data?: Paths.EstimateFee.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.EstimateFee.Responses.$200>
  }
  ['/orders/new']: {
    /**
     * createOrder - Submit a new order.
     */
    'post'(
      parameters?: Parameters<Paths.OrdersNew.HeaderParameters> | null,
      data?: Paths.CreateOrder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOrder.Responses.$200>
  }
  ['/orders/address/{address}']: {
    /**
     * getOrdersByAddress - Get Orders for user address.
     */
    'get'(
      parameters?: Parameters<Paths.OrdersAddress$Address.PathParameters & Paths.OrdersAddress$Address.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOrdersByAddress.Responses.$200>
  }
  ['/orders/address/{address}/active']: {
    /**
     * getActiveOrdersByAddress - Get active Orders for user address.
     */
    'get'(
      parameters?: Parameters<Paths.OrdersAddress$AddressActive.PathParameters & Paths.OrdersAddress$AddressActive.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetActiveOrdersByAddress.Responses.$200>
  }
  ['/permissions/executors']: {
    /**
     * getExecutors - Get addresses with executor permissions.
     */
    'get'(
      parameters?: Parameters<Paths.PermissionsExecutors.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetExecutors.Responses.$200>
  }
  ['/quote_tokens']: {
    /**
     * getSupportedQuoteTokens - Returns all quote tokens on the chain specified in the X-Chain_Id header
     */
    'get'(
      parameters?: Parameters<Paths.QuoteTokens.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSupportedQuoteTokens.Responses.$200>
  }
  ['/quote_tokens/{address}']: {
    /**
     * isTokenSupported - Checks whether the specified quote token is approved.
     */
    'get'(
      parameters?: Parameters<Paths.QuoteTokens$Address.PathParameters & Paths.QuoteTokens$Address.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.IsTokenSupported.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
export type Order = Order;
