import { LinkButton } from "../components";
import { LongCopyPage } from "../components/common/LongCopyPage";

const TITLE = "Mission";
const INTRO = `Our mission at Bond Protocol is to reshape the future of the crypto industry by equipping projects with the tools needed for sustainable treasury growth. In recent years, DAOs have struggled to keep the lights on due to poor treasury management and lack of proper tools.

   We're rewriting this narrative by offering practical solutions to the challenges of treasury and token emissions management.`;

const APPROACH = `We create permissionless products that break down onboarding barriers for all projects regardless of their size or experience, making it seamless for anyone to kickstart their treasury management initiatives. 

Our core belief is that powerful tools should be accessible to all, not limited to a few. We make this evident in every aspect of Bond Protocol from go-to-market resources, to our permissionless dApp, and ready-to-use smart contracts. 
`;

const JOIN_THE_MOVEMENT =
  "The first step towards financial stability starts with the right tools. Whether you're a seasoned project or just entering the space, we welcome you to join our mission. To get started, simply browse through our resources or reach out to us through our request form.";

const PARTNER_LINK = "/hello";

const content = [
  { title: "Our Approach", description: APPROACH },

  { title: "Join the movement", description: JOIN_THE_MOVEMENT },
];

export default function MissionPage() {
  return (
    <LongCopyPage title={TITLE} intro={INTRO} content={content}>
      <LinkButton href={PARTNER_LINK} target="_self">
        REACH OUT
      </LinkButton>
    </LongCopyPage>
  );
}
