export const calcDiscountPercentage = (
  price: number,
  discountedPrice: number
) => {
  return (100 * (price - discountedPrice)) / price;
};
