import { LinkButton } from "../components";
import { TextCard } from "../components/common/TextCard";

const TITLE = "Journey";
const INTRO =
  "Since our launch on October 3rd, 2022, Bond Protocol has achieved significant milestones from product launches to product improvements, but most importantly had a critical impact on our partners.";

const IMPACT =
  "Across several issuers, our permissionless bond marketplace has facilitated over $60 million in Total Bonded Value — empowering treasury diversification, funding for runway and growth initiatives, protocol-owned liquidity acquisition, and strategic asset acquisition. And with over over 4000 bondings, the opportunity for users to acquire their favorite governance tokens at a discount while providing massive value to the protocol has proven to be a win-win scenario.";

const OLM =
  "Our journey doesn’t stop there. Options Liquidity Mining <link to products page> went live on (blank for now), a powerful addition to our product suite that marks a new standard for emissions management.";

const WORK_WITH_US = `
If there's a product you envision, a tool you're missing, or an enhancement you seek, we're all ears. Let's work together to build what you need.
`;

export default function JourneyPage() {
  return (
    <div className="min-h-[75vh] bg-black/20 backdrop-blur-md mb-20">
      <div className="mt-10 lg:px-40 flex flex-col gap-y-20 p-4">
        <div>
          <h2 className="text-8xl font-fraktion font-bold">{TITLE}</h2>
          <p className="mt-4 text-xl md:pr-[50%]">{INTRO}</p>
        </div>
        <TextCard
          title="IMPACT"
          description={IMPACT}
          className="text-left pr-[30%]"
        />
        <TextCard
          title="OLM"
          description={OLM}
          className="text-right pl-[30%]"
        />

        <TextCard
          title="Work with us"
          description={WORK_WITH_US}
          className="text-left pr-[30%]"
        />

        <LinkButton href="/hello" target="_self">
          JOIN THE TIMELINE
        </LinkButton>
      </div>
    </div>
  );
}
