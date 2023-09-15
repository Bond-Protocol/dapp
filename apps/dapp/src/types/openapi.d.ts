import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
    namespace Parameters {
        export type AccountAddressParameter = string;
        export type AddressParameter = string;
        export type ApiKeyParameter = string;
        export type AuctioneerAddressParameter = string;
        export type ChainIdParameter = number;
        export type MarketIdParameter = number;
        export type OrderDigestParameter = string;
        export type OrderIdParameter = number;
    }
    export interface PathParameters {
        AccountAddressParameter?: Parameters.AccountAddressParameter;
        AddressParameter?: Parameters.AddressParameter;
        AuctioneerAddressParameter?: Parameters.AuctioneerAddressParameter;
        ApiKeyParameter?: Parameters.ApiKeyParameter;
        ChainIdParameter?: Parameters.ChainIdParameter;
        MarketIdParameter?: Parameters.MarketIdParameter;
        OrderIdParameter?: Parameters.OrderIdParameter;
        OrderDigestParameter?: Parameters.OrderDigestParameter;
    }
    namespace Responses {
        export type ConfigArrayResponse = /* An API service Config object */ Schemas.Config[];
        export type ExternalServicesArrayResponse = /* External API configuration */ Schemas.ExternalServices[];
        export type MarketArrayResponse = /* Record of a Market. */ Schemas.Market[];
        export type MarketIdResponse = number;
    }
    namespace Schemas {
        /**
         * An API service Config object
         */
        export interface Config {
            /**
             * The Config's chain_id
             */
            chain_id?: number;
            /**
             * The Config's Aggregator contract address
             */
            aggregator?: string;
            /**
             * The Config's Settlement contract address
             */
            settlement?: string;
        }
        /**
         * Parameters for a request to create a new Config
         */
        export interface ConfigRequest {
            /**
             * The Config's chain_id
             */
            chain_id?: number;
            /**
             * The Config's Aggregator contract address
             */
            aggregator?: string;
            /**
             * The Config's Settlement contract address
             */
            settlement?: string;
            /**
             * A list of the Config's Auctioneer contract addresses
             */
            auctioneers?: any[];
        }
        /**
         * External API configuration
         */
        export interface ExternalServices {
            /**
             * The chain_id for the services
             */
            chain_id?: number;
            /**
             * An RPC endpoint
             */
            rpc_url?: string;
            /**
             * Chain name abbreviation used by Owlracle API
             */
            owlracle_abbr?: string;
            /**
             * Historical gas price
             */
            hist_gas_price?: number;
            /**
             * Timestamp of last gas price update
             */
            gas_price_last_updated?: number;
        }
        /**
         * A JSON object containing two string fields, access_token and refresh_token.
         */
        export interface JWTPair {
            /**
             * the access token
             */
            access_token?: string;
            /**
             * the refresh token
             */
            refresh_token?: string;
        }
        /**
         * Record of a Market.
         */
        export interface Market {
            /**
             * The ID of the Market.
             */
            market_id?: number;
            /**
             * The ID of the chain on which the Market is running.
             */
            chain_id?: number;
            /**
             * The address of the Market's Aggregator contract.
             */
            aggregator?: string;
            /**
             * Whether or not the Market is currently active.
             */
            active?: boolean;
            /**
             * Timestamp for the Market start.
             */
            start?: number;
            /**
             * Timestamp for the Market end.
             */
            conclusion?: number;
            /**
             * The address of the Market's Payout Token.
             */
            payout_token?: string;
            /**
             * The address of the Market's Quote Token.
             */
            quote_token?: string;
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
         * A User with permission to use the private api
         */
        export interface Permission {
            /**
             * The API key for this Permission
             */
            api_key?: string;
            /**
             * The address of the user with the Permission
             */
            address?: string;
            /**
             * The Role the user holds
             */
            role?: string;
        }
        /**
         * Data required to create a new Permission
         */
        export interface PermissionRequest {
            /**
             * The address to be given a Permission
             */
            address?: string;
            /**
             * The role to be given to the specified Address
             */
            role?: string;
        }
        /**
         * A JSON object containing two string fields, a Sign in With Ethereum message and signature. The nonce found in the decoded signature should match the nonce in the message.
         */
        export type SigninData = any;
    }
}
declare namespace Paths {
    namespace Configs {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.ConfigArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ConfigsChain$ChainId {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.ChainIdParameter;
            }
            namespace Responses {
                export type $200 = Components.Responses.ConfigArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ConfigsNew {
        namespace Post {
            export type RequestBody = /* Parameters for a request to create a new Config */ Components.Schemas.ConfigRequest;
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ConfigsRemove {
        namespace Post {
            export type RequestBody = /* An API service Config object */ Components.Schemas.Config;
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ConfigsUpdateAddAuctioneer$Auctioneer {
        namespace Post {
            namespace Parameters {
                export type $0 = Components.Parameters.AuctioneerAddressParameter;
            }
            export type RequestBody = /* An API service Config object */ Components.Schemas.Config;
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ConfigsUpdateRemoveAuctioneer$Auctioneer {
        namespace Post {
            namespace Parameters {
                export type $0 = Components.Parameters.AuctioneerAddressParameter;
            }
            export type RequestBody = /* An API service Config object */ Components.Schemas.Config;
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
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
    namespace ExternalServices {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.ExternalServicesArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
        namespace Post {
            export type RequestBody = /* External API configuration */ Components.Schemas.ExternalServices;
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ExternalServicesChain$ChainId {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.ChainIdParameter;
            }
            namespace Responses {
                export type $200 = /* External API configuration */ Components.Schemas.ExternalServices;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace ExternalServicesRemove$ChainId {
        namespace Post {
            namespace Parameters {
                export type $0 = Components.Parameters.ChainIdParameter;
            }
            namespace Responses {
                /**
                 * Success message.
                 */
                export type $200 = string;
                export interface $400 {
                }
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace FeesCurrent$OrderDigest {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.OrderDigestParameter;
            }
            namespace Responses {
                export type $200 = number;
                export interface $400 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace FeesEstimate {
        namespace Get {
            export type RequestBody = /* Details of an existing order. */ Components.Schemas.Order;
            namespace Responses {
                export type $200 = number;
                export interface $400 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace GetActiveOrdersByMarket {
        namespace Parameters {
            export type $0 = Components.Parameters.MarketIdParameter;
        }
        namespace Responses {
            export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
            export interface $401 {
            }
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
            export type $200 = string;
            export interface $400 {
            }
            export interface $401 {
            }
        }
    }
    namespace Markets {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.MarketArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace Markets$MarketId {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.MarketIdParameter;
            }
            namespace Responses {
                export type $200 = /* Record of a Market. */ Components.Schemas.Market;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
        namespace Post {
            namespace Parameters {
                export type $0 = Components.Parameters.MarketIdParameter;
            }
            namespace Responses {
                export type $200 = Components.Responses.MarketIdResponse;
                export interface $400 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace Markets$MarketIdClose {
        namespace Post {
            namespace Parameters {
                export type $0 = Components.Parameters.MarketIdParameter;
            }
            namespace Responses {
                export type $200 = Components.Responses.MarketIdResponse;
                export interface $400 {
                }
                export interface $401 {
                }
            }
        }
    }
    namespace MarketsActive {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.MarketArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace MarketsLive {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.MarketArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace MarketsUpcoming {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.MarketArrayResponse;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace Orders$OrderId {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.OrderIdParameter;
            }
            namespace Responses {
                export type $200 = /* Details of an existing order. */ Components.Schemas.Order;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace OrdersMarket$MarketId {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.MarketIdParameter;
            }
            namespace Responses {
                export type $200 = /* Details of an existing order. */ Components.Schemas.Order[];
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace Permissions {
        namespace Get {
            namespace Responses {
                export type $200 = /* A User with permission to use the private api */ Components.Schemas.Permission[];
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace PermissionsAddress$Address {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.AddressParameter;
            }
            namespace Responses {
                export type $200 = /* A User with permission to use the private api */ Components.Schemas.Permission;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace PermissionsAdmins {
        namespace Get {
            namespace Responses {
                export type $200 = string[];
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace PermissionsChange {
        namespace Post {
            export type RequestBody = string;
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
    namespace PermissionsKey$ApiKey {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.ApiKeyParameter;
            }
            namespace Responses {
                export type $200 = /* A User with permission to use the private api */ Components.Schemas.Permission;
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace PermissionsMarketTrackers {
        namespace Get {
            namespace Responses {
                export type $200 = string[];
                export interface $401 {
                }
                export interface $500 {
                }
            }
        }
    }
    namespace PermissionsNew {
        namespace Post {
            export type RequestBody = /* Data required to create a new Permission */ Components.Schemas.PermissionRequest;
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
    }
    namespace PermissionsRemove {
        namespace Post {
            export type RequestBody = /* Data required to create a new Permission */ Components.Schemas.PermissionRequest;
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
    }
    namespace QuoteTokens {
        namespace Get {
            namespace Responses {
                export type $200 = any[];
                export interface $500 {
                }
            }
        }
    }
    namespace QuoteTokens$Address {
        namespace Get {
            namespace Parameters {
                export type $0 = Components.Parameters.AddressParameter;
            }
            namespace Responses {
                export type $200 = boolean;
                export interface $500 {
                }
            }
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
   * signIn - Signs the user in, creating and returning a JWT
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
   * createOrder - Submit a new order.
   */
  'createOrder'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOrder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOrder.Responses.$200>
  /**
   * getOrdersByAddress - Get Orders for user address.
   */
  'getOrdersByAddress'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOrdersByAddress.Responses.$200>
  /**
   * getActiveOrdersByMarket - Get active Orders for the specified Market.
   */
  'getActiveOrdersByMarket'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetActiveOrdersByMarket.Responses.$200>
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
     * signIn - Signs the user in, creating and returning a JWT
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
  ['/configs']: {
  }
  ['/configs/chain/{chain_id}']: {
  }
  ['/configs/new']: {
  }
  ['/configs/remove']: {
  }
  ['/configs/update/add_auctioneer/{auctioneer}']: {
  }
  ['/configs/update/remove_auctioneer/{auctioneer}']: {
  }
  ['/external-services']: {
  }
  ['/external-services/remove/{chain_id}']: {
  }
  ['/external-services/chain/{chain_id}']: {
  }
  ['/fees/estimate']: {
  }
  ['/fees/current/{order_digest}']: {
  }
  ['/markets/{market_id}']: {
  }
  ['/markets/{market_id}/close']: {
  }
  ['/markets']: {
  }
  ['/markets/active']: {
  }
  ['/markets/live']: {
  }
  ['/markets/upcoming']: {
  }
  ['/orders/new']: {
    /**
     * createOrder - Submit a new order.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOrder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOrder.Responses.$200>
  }
  ['/orders/address/{account_address}']: {
    /**
     * getOrdersByAddress - Get Orders for user address.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOrdersByAddress.Responses.$200>
  }
  ['/orders/{order_id}']: {
  }
  ['/orders/market/{market_id}']: {
  }
  ['/orders/market/{market_id}/active']: {
    /**
     * getActiveOrdersByMarket - Get active Orders for the specified Market.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetActiveOrdersByMarket.Responses.$200>
  }
  ['/permissions']: {
  }
  ['/permissions/address/{address}']: {
  }
  ['/permissions/key/{api_key}']: {
  }
  ['/permissions/admins']: {
  }
  ['/permissions/executors']: {
  }
  ['/permissions/market_trackers']: {
  }
  ['/permissions/new']: {
  }
  ['/permissions/remove']: {
  }
  ['/permissions/change']: {
  }
  ['/quote_tokens']: {
  }
  ['/quote_tokens/{address}']: {
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
