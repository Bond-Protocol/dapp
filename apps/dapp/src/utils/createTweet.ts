export const createTweet = (discount: string, symbol: string) => {
  return (
    "https://twitter.com/intent/tweet?text=I just received a " +
    discount +
    "% discount on $" +
    symbol +
    " thanks to @Bond_Protocol bonds. Don't miss out on yours! " +
    //  (bond.socials.twitter ? bond.socials.twitter + `,` : "") +
    " %0A%0Abondprotocol.finance"
  );
};
