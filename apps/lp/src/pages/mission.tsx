import { LinkButton } from "../components";
import { TextCard } from "../components/common/TextCard";

const INTRO =
  "Our mission at Bond Protocol is to reshape the future of the crypto industry by equipping projects with the tools needed for sustainable treasury growth. In recent years, DAOs have struggled to keep the lights on due to poor treasury management and lack of proper tools.";

const REWRITING =
  "We're rewriting this narrative by offering practical solutions to the challenges of treasury and token emissions management.";
const APPROACH = `We create permissionless products that break down onboarding barriers for all projects regardless of their size or experience, making it seamless for anyone to kickstart their treasury management initiatives. 

Our core belief is that powerful tools should be accessible to all, not limited to a few. We make this evident in every aspect of Bond Protocol from go-to-market resources, to our permissionless dApp, and ready-to-use smart contracts. 
`;

const JOIN_THE_MOVEMENT =
  "The first step towards financial stability starts with the right tools. Whether you're a seasoned project or just entering the space, we welcome you to join our mission. To get started, simply browse through our resources or reach out to us through our request form.";

const PARTNER_LINK = "/hello";

export default function MissionPage() {
  return (
    <div className="min-h-[75vh] bg-black/20 backdrop-blur-md ">
      <div className="mt-6 lg:px-40 flex flex-col gap-y-16 p-4">
        <div className="mt-10">
          <p className="mt-1 text-3xl font-light text-center px-4">{INTRO}</p>
          <h3 className="text-3xl font-light text-center mt-10 px-40">
            {REWRITING}
          </h3>
        </div>
        <TextCard title="Our Approach" description={APPROACH} />
        <TextCard title="Join the Movement" description={JOIN_THE_MOVEMENT} />
        <LinkButton href={PARTNER_LINK} target="_self">
          REACH OUT
        </LinkButton>
      </div>
    </div>
  );
}
