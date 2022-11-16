export const formatSymbolForWallet = (symbol: string) => {
  const parts = symbol.split("-");
  const length = parts[0].length;

  if (length <= 4) {
    return symbol.replace("-20", "-");
  } else if (length === 5) {
    return symbol.replace("-20", "");
  } else if (length === 6) {
    return parts[0].concat("-").concat(parts[1].substring(parts[1].length - 4));
  } else {
    return parts[0].substring(0, 6).concat("-").concat(parts[1].substring(parts[1].length - 4));
  }
};
