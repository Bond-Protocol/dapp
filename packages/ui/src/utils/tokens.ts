export const coingeckoResponseToSelectOption = (token: any) => {
  return {
    id: token.id,
    value: token.id,
    image: token.image.small,
    label: token.symbol.toUpperCase(),
  };
};
