import { BondPriceChart } from "./BondPriceChart";

const rugPull = [
  { date: 1672531200000, price: 0, discountedPrice: 0, discount: 0 },
  { date: 1672535200000, price: 1, discountedPrice: 1.1, discount: -10 },
  { date: 1672539200000, price: 1, discountedPrice: 0.75, discount: 25 },
  { date: 1672543200000, price: 3, discountedPrice: 3.3, discount: -10 },
  { date: 1672547200000, price: 4, discountedPrice: 3, discount: 25 },
  { date: 1672551200000, price: 13, discountedPrice: 16.25, discount: -25 },
  { date: 1672555200000, price: 16, discountedPrice: 12, discount: 25 },
  { date: 1672559200000, price: 48, discountedPrice: 60, discount: -20 },
  { date: 1672563200000, price: 54, discountedPrice: 40.5, discount: 25 },
  { date: 1672567200000, price: 65, discountedPrice: 81.25, discount: -25 },
  { date: 1672571200000, price: 71, discountedPrice: 53.25, discount: 25 },
  { date: 1672575200000, price: 98, discountedPrice: 122.5, discount: -25 },
  { date: 1672579200000, price: 109, discountedPrice: 81.75, discount: 25 },
  { date: 1672583200000, price: 153, discountedPrice: 191.25, discount: -25 },
  { date: 1672587200000, price: 213, discountedPrice: 159.75, discount: 25 },
  { date: 1672591200000, price: 285, discountedPrice: 225, discount: 25 },
  { date: 1672595200000, price: 385, discountedPrice: 288.75, discount: 25 },
  { date: 1672599200000, price: 414, discountedPrice: 517.5, discount: -25 },
  { date: 1672603200000, price: 402, discountedPrice: 301.5, discount: 25 },
  { date: 1672607200000, price: 408, discountedPrice: 510, discount: -20 },
  { date: 1672611200000, price: 437, discountedPrice: 328.125, discount: 25 },
  { date: 1672615200000, price: 0, discountedPrice: 0, discount: 0 },
  { date: 1672633200000, price: 0, discountedPrice: 0, discount: 0 },
  { date: 1672669200000, price: 0, discountedPrice: 0, discount: 0 },
];

export const PlaceholderChart = ({
  message,
  downBad,
}: {
  message?: string | React.ReactNode;
  downBad?: boolean;
}) => {
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative h-full w-full">
          <div className="absolute top-[45%] h-[50%] w-full">
            <div className="text-center text-xs">{message}</div>
          </div>
          <div className="h-[99%] w-full">
            <BondPriceChart payoutTokenSymbol="NGMI" data={rugPull} />
          </div>
        </div>
      </div>
    </>
  );
};
