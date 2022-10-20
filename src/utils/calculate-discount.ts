/**Calculates how much discount or premium and at what price a purchase was made based of the amount, payout and price*/
export const calcDiscount = (amount: string, payout: string, price: number) => {
  const discountedPrice = (parseFloat(amount) * price) / parseFloat(payout);
  const discount = (100 * (price - discountedPrice)) / price;
  return { discount, discountedPrice };
};
