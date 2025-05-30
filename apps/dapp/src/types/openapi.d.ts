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
             * A JWT access token
             */
            access_token?: string;
            /**
             * A JWT refresh token
             */
            refresh_token?: string;
        }
        /**
         * Details of an existing order.
         */
        export interface Order {
            /**
             * The hash digest of the order. Used to uniquely identify an order.
             */
            digest?: string;
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
             * Signature of the order digest by the user. Not provided by API.
             */
            signature?: string;
            /**
             * The ID of the chain the order was submitted on.
             */
            chain_id?: number;
            /**
             * The address of the aggregator that the order was submitted to.
             */
            aggregator?: string;
            /**
             * The address of the settlement contract that the order was submitted to.
             */
            settlement?: string;
            /**
             * The amount of quote tokens that have been filled for the order.
             */
            filled?: string;
            /**
             * The status of the order. Statuses are Active, Pending, Executed, Cancelled
             */
            status?: string;
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
             * The messaged use with Sign-In with Ethereum
             */
            message?: string;
            /**
             * The Sign-In with Ethereum Signature
             */
            signature?: string;
        }
    }
}
declare namespace Paths {
    namespace CancelAllOrdersByMarket {
        namespace Responses {
            export type $200 = string;
            export interface $400 {
            }
            export interface $401 {
            }
            export interface $500 {
            }
        }
    }
    namespace CancelOrderByDigest {
        namespace Responses {
            export type $200 = string;
            export interface $400 {
            }
            export interface $401 {
            }
            export interface $500 {
            }
        }
    }
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
        namespace Responses {
            export type $200 = string;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace FeesEstimate$MarketId {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type MarketId = number;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            market_id: Parameters.MarketId;
        }
    }
    namespace GetActiveOrdersByAddress {
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
            export interface $500 {
            }
        }
    }
    namespace GetActiveUserOrdersByMarket {
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
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
            export type $200 = {
                /**
                 * The token contract address
                 */
                $0?: string;
                /**
                 * The token contract chain id
                 */
                $1?: string;
            }[];
            export interface $500 {
            }
        }
    }
    namespace GetUserOrdersByMarket {
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
            export interface $500 {
            }
        }
    }
    namespace IsQuoteTokenSupported {
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
    namespace OrdersAddress$AddressMarket$MarketId {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type MarketId = number;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
            market_id: Parameters.MarketId;
        }
    }
    namespace OrdersAddress$AddressMarket$MarketIdActive {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type MarketId = number;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
            market_id: Parameters.MarketId;
        }
    }
    namespace OrdersAddress$AddressMarket$MarketIdCancel {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type MarketId = number;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
            market_id: Parameters.MarketId;
        }
    }
    namespace OrdersAddress$AddressOrder$DigestCancel {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type Address = string;
            export type Digest = string;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
            digest: Parameters.Digest;
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
        namespace Get {
            namespace Responses {
                export type $200 = string[];
                export interface $500 {
                }
            }
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
    namespace QuoteTokens$TokenAddress {
        export interface HeaderParameters {
            "x-chain-id": Parameters.XChainId;
            "x-aggregator": Parameters.XAggregator;
            "x-settlement": Parameters.XSettlement;
        }
        namespace Parameters {
            export type TokenAddress = string;
            export type XAggregator = string;
            export type XChainId = number;
            export type XSettlement = string;
        }
        export interface PathParameters {
            token_address: Parameters.TokenAddress;
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
        namespace Parameters {
            export type Address = string;
        }
        export interface PathParameters {
            address: Parameters.Address;
        }
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
    parameters?: Parameters<Paths.TestAuth.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TestAuth.Responses.$200>
  /**
   * estimateFee - Estimates fees for an Order on the provided Market.
   */
  'estimateFee'(
    parameters?: Parameters<Paths.FeesEstimate$MarketId.PathParameters & Paths.FeesEstimate$MarketId.HeaderParameters> | null,
    data?: any,
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
   * cancelOrderByDigest - Cancel an order.
   */
  'cancelOrderByDigest'(
    parameters?: Parameters<Paths.OrdersAddress$AddressOrder$DigestCancel.PathParameters & Paths.OrdersAddress$AddressOrder$DigestCancel.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CancelOrderByDigest.Responses.$200>
  /**
   * cancelAllOrdersByMarket - Cancel all orders for a market.
   */
  'cancelAllOrdersByMarket'(
    parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketIdCancel.PathParameters & Paths.OrdersAddress$AddressMarket$MarketIdCancel.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CancelAllOrdersByMarket.Responses.$200>
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
   * getUserOrdersByMarket - Get Orders for user address for a specific market.
   */
  'getUserOrdersByMarket'(
    parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketId.PathParameters & Paths.OrdersAddress$AddressMarket$MarketId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUserOrdersByMarket.Responses.$200>
  /**
   * getActiveUserOrdersByMarket - Get active Orders for user address for a specific market.
   */
  'getActiveUserOrdersByMarket'(
    parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketIdActive.PathParameters & Paths.OrdersAddress$AddressMarket$MarketIdActive.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetActiveUserOrdersByMarket.Responses.$200>
  /**
   * getSupportedQuoteTokens - Returns all quote tokens on the chain specified in the X-Chain_Id header
   */
  'getSupportedQuoteTokens'(
    parameters?: Parameters<Paths.QuoteTokens.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSupportedQuoteTokens.Responses.$200>
  /**
   * isQuoteTokenSupported - Checks whether the specified quote token is approved.
   */
  'isQuoteTokenSupported'(
    parameters?: Parameters<Paths.QuoteTokens$TokenAddress.PathParameters & Paths.QuoteTokens$TokenAddress.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.IsQuoteTokenSupported.Responses.$200>
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
  ['/auth/test/{address}']: {
    /**
     * testAuth - Tests whether signed in user can view address provided in params.
     */
    'get'(
      parameters?: Parameters<Paths.TestAuth.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TestAuth.Responses.$200>
  }
  ['/fees/estimate/{market_id}']: {
    /**
     * estimateFee - Estimates fees for an Order on the provided Market.
     */
    'get'(
      parameters?: Parameters<Paths.FeesEstimate$MarketId.PathParameters & Paths.FeesEstimate$MarketId.HeaderParameters> | null,
      data?: any,
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
  ['/orders/address/{address}/order/{digest}/cancel']: {
    /**
     * cancelOrderByDigest - Cancel an order.
     */
    'post'(
      parameters?: Parameters<Paths.OrdersAddress$AddressOrder$DigestCancel.PathParameters & Paths.OrdersAddress$AddressOrder$DigestCancel.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CancelOrderByDigest.Responses.$200>
  }
  ['/orders/address/{address}/market/{market_id}/cancel']: {
    /**
     * cancelAllOrdersByMarket - Cancel all orders for a market.
     */
    'post'(
      parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketIdCancel.PathParameters & Paths.OrdersAddress$AddressMarket$MarketIdCancel.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CancelAllOrdersByMarket.Responses.$200>
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
  ['/orders/address/{address}/market/{market_id}']: {
    /**
     * getUserOrdersByMarket - Get Orders for user address for a specific market.
     */
    'get'(
      parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketId.PathParameters & Paths.OrdersAddress$AddressMarket$MarketId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUserOrdersByMarket.Responses.$200>
  }
  ['/orders/address/{address}/market/{market_id}/active']: {
    /**
     * getActiveUserOrdersByMarket - Get active Orders for user address for a specific market.
     */
    'get'(
      parameters?: Parameters<Paths.OrdersAddress$AddressMarket$MarketIdActive.PathParameters & Paths.OrdersAddress$AddressMarket$MarketIdActive.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetActiveUserOrdersByMarket.Responses.$200>
  }
  ['/permissions/executors']: {
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
  ['/quote_tokens/{token_address}']: {
    /**
     * isQuoteTokenSupported - Checks whether the specified quote token is approved.
     */
    'get'(
      parameters?: Parameters<Paths.QuoteTokens$TokenAddress.PathParameters & Paths.QuoteTokens$TokenAddress.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.IsQuoteTokenSupported.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
export type Order = Components.Schemas.Order;
