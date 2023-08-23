import { LinkButton } from "../components";
import { LongCopyPage } from "../components/common/LongCopyPage";

const TITLE = "Journey";
const INTRO =
  "Since our launch on October 3rd, 2022, Bond Protocol has achieved significant milestones from product launches to product improvements, but most importantly had a critical impact on our partners.";

const IMPACT =
  "Across several issuers, our permissionless bond marketplace has facilitated over $60 million in Total Bonded Value — empowering treasury diversification, funding for runway and growth initiatives, protocol-owned liquidity acquisition, and strategic asset acquisition. And with over 4000 bondings, the opportunity for users to acquire their favorite governance tokens at a discount while providing massive value to the protocol has proven to be a win-win scenario.";

const OLM =
  "Our journey doesn’t stop there. Options Liquidity Mining <link to products page> went live on (blank for now), a powerful addition to our product suite that marks a new standard for emissions management.";

const WORK_WITH_US = `
If there's a product you envision, a tool you're missing, or an enhancement you seek, we're all ears. Let's work together to build what you need.
`;

const content = [
  { title: "IMPACT", description: IMPACT },
  { title: "OLM", description: OLM },
  { title: "Work with us", description: WORK_WITH_US },
];

export default function JourneyPage() {
  return (
    <LongCopyPage title={TITLE} intro={INTRO} content={content}>
      <LinkButton href="/hello" target="_self">
        JOIN THE TIMELINE
      </LinkButton>
    </LongCopyPage>
  );
}
