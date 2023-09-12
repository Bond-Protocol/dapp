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
            access_token: string;
            refresh_token: string;
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
             * The SiWE message
             */
            message: string;
            /**
             *
             */
            signature: string;
        }
    }
}
declare namespace Paths {
    namespace CreateOrder {
        export type RequestBody = /* Parameters for an order, including a signature. */ Components.Schemas.OrderRequest;
        namespace Responses {
            export interface $500 {
            }
        }
    }
    namespace GetActiveOrdersByAddress {
        namespace Parameters {
            export type AccountAddress = string;
        }
        export interface PathParameters {
            account_address: Parameters.AccountAddress;
        }
        namespace Responses {
            export interface $500 {
            }
        }
    }
    namespace GetExecutors {
        namespace Responses {
            export interface $500 {
            }
        }
    }
    namespace GetNonce {
        namespace Responses {
            export interface $500 {
            }
        }
    }
    namespace GetOrdersByAddress {
        namespace Parameters {
            export type AccountAddress = string;
        }
        export interface PathParameters {
            account_address: Parameters.AccountAddress;
        }
        namespace Responses {
            export interface $500 {
            }
        }
    }
    namespace RefreshAuth {
        namespace Responses {
            export type $200 = /* A JSON object containing two string fields, access_token and refresh_token. */ Components.Schemas.JWTPair;
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
  ): OperationResponse<any>
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
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RefreshAuth.Responses.$200>
  /**
   * testAuth - Tests whether signed in user can view address provided in params.
   */
  'testAuth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createOrder - Submit a new order.
   */
  'createOrder'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOrder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getOrdersByAddress - Get orders for user address
   */
  'getOrdersByAddress'(
    parameters?: Parameters<Paths.GetOrdersByAddress.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getActiveOrdersByAddress - Get active orders for user address
   */
  'getActiveOrdersByAddress'(
    parameters?: Parameters<Paths.GetActiveOrdersByAddress.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getExecutors - Get addresses with executor permissions
   */
  'getExecutors'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
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
    ): OperationResponse<any>
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
      data?: any,
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
    ): OperationResponse<any>
  }
  ['/orders/new']: {
    /**
     * createOrder - Submit a new order.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOrder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/orders/address/{account_address}']: {
    /**
     * getOrdersByAddress - Get orders for user address
     */
    'get'(
      parameters?: Parameters<Paths.GetOrdersByAddress.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/orders/address/{account_address}/active']: {
    /**
     * getActiveOrdersByAddress - Get active orders for user address
     */
    'get'(
      parameters?: Parameters<Paths.GetActiveOrdersByAddress.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/permissions/executors']: {
    /**
     * getExecutors - Get addresses with executor permissions
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
