import { LinkButton } from "../components";
import { LongCopyPage } from "../components/common/LongCopyPage";

const TITLE = "Products";
const INTRO =
  " Our products are engineered to address the unique challenges faced by projects of all sizes and cater to diverse needs within the crypto landscape. ";

const BONDS =
  "The Bond Marketplace is at the heart of our product suite, offering a new approach to asset acquisition and treasury diversification. It enables projects to issue vested tokens at a discount and acquire assets quickly. Whether for gradual/aggressive asset acquisition or more strategic initiatives, the Bond Marketplace empowers projects to navigate market complexities while minimizing slippage and price impact.";

const OLM =
  "OLM enables protocols to mint ERC-20 call options as incentives for various use cases. Compared to traditional incentive mechanisms, it allows protocols to acquire assets when rewards are paid out and provides greater flexibility when designing emissions strategies. Our solution also breaks free for oracle-reliance, making it accessible to a wide range of protocols.";

const BOND_DESCRIPTION = `can choose from fixed-term or fixed-expiry vesting types, short-term or long-term vesting durations, and auction types such as Sequential Dutch Auctions, Fixed-Price Auctions, or Oracle-based Auctions.`;

const OLM_DESCRIPTION = `can set strike prices, select quote and payout assets, configure epoch lengths, and define eligibility windows.`;

const Card = ({ title, content }: any) => {
  return (
    <div className="text-center p-4 backdrop-blur-md bg-white/5">
      <p className="text-xl">
        <span className="font-semibold">{title}</span> {content}{" "}
      </p>
    </div>
  );
};

const content = [
  { title: "Permissionless Bond Marketplace", description: BONDS },
  { title: "Options Liquidity Minig", description: OLM },
];

export default function ProductsPage() {
  return (
    <LongCopyPage title={TITLE} intro={INTRO} content={content}>
      <div className="mt-4">
        <div className="font-fraktion text-center text-5xl font-semibold uppercase">
          {"Configurability at your fingertips"}
        </div>
        <div className="mt-4 flex justify-around child:w-1/3 child:my-auto">
          <Card title="Bond market issuers" content={BOND_DESCRIPTION} />

          <Card
            title="Option Liquidity Mining Issuers"
            content={OLM_DESCRIPTION}
          />
        </div>
      </div>
      <div className="flex gap-x-4 justify-center child:mx-0">
        <LinkButton variant="ghost" href="https://docs.bondprotocol.finance">
          Learn more
        </LinkButton>
        <LinkButton href="/hello" target="_self">
          Contact Us
        </LinkButton>
      </div>
    </LongCopyPage>
  );
}
