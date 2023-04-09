class BondProtocolError extends Error {
  constructor(message: string, prefix = "") {
    super(`${prefix}: ${message}`);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const defaultErrorHandler = (error: Error) => {
  console.error(new BondProtocolError(error.message));
  return "invalid";
};

export const withErrorHandling = (
  fn: Function,
  handler = defaultErrorHandler
) => {
  return (...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      return handler(error as any);
    }
  };
};

export const wrapWithErrorHandler = <
  T extends Record<string, (...args: any[]) => any>
>(
  functions: T
): { [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> } => {
  const keys = Object.keys(functions);

  return keys.reduce((funcs, name) => {
    return {
      ...funcs,
      [name]: withErrorHandling(functions[name]),
    };
  }, {}) as { [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> };
};
