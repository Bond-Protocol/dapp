import { useNavigate } from "react-router-dom";
import { Accordion, Button, ProtocolLogo } from "ui";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";
import { Footer } from "components/organisms";

export type InformationAreaProps = {
  onClose: () => void;
  open?: boolean;
};

const issueLink = (
  <a
    href="https://docs.bondprotocol.finance/bond-marketplace/deploy-a-bond-market"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black underline"
  >
    Find out how!
  </a>
);

const verificationLink = (
  <a
    href="https://docs.bondprotocol.finance/bond-marketplace/market-verification"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black underline"
  >
    Find out how!
  </a>
);

const closeLink = (
  <a
    href="https://docs.bondprotocol.finance/bond-marketplace/my-markets"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black underline"
  >
    Find out how!
  </a>
);

const bondLink = (
  <a
    href="https://docs.bondprotocol.finance/bond-marketplace/purchasing-a-bond"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black underline"
  >
    Find out how!
  </a>
);

const whoLink = (
  <a
    href="https://docs.bondprotocol.finance/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black underline"
  >
    Check out our Protocol Overview!
  </a>
);

const content = [
  {
    label: "How to issue a bond",
    content: (
      <div>
        Interested in issuing a bond market for your protocol? {issueLink}
      </div>
    ),
  },
  {
    label: "How to get verified",
    content: (
      <div>
        You can create a market and run your own UI without verification, but if
        you want your market to be listed on the BondProtocol dApp, you need to
        verify your protocol. {verificationLink}
      </div>
    ),
  },
  {
    label: "How to close an issued bond",
    content: (
      <div>
        Want to close a market before it expires or sells out its full capacity?{" "}
        {closeLink}
      </div>
    ),
  },
  {
    label: "How to bond",
    content: <div>Want to purchase a bond listed on the dApp? {bondLink}</div>,
  },
  {
    label: "Who are we",
    content: (
      <div>Interested in finding out more about BondProtocol? {whoLink}</div>
    ),
  },
];

export const InformationArea = (props: InformationAreaProps) => {
  const navigate = useNavigate();

  const goToCreateMarket = () => {
    props.onClose();
    navigate("/create");
  };

  return (
    <div
      className={`fixed inset-0 z-10 h-[100vh] bg-light-base transition-transform duration-500 ${
        props.open ? "-translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-[90vh] bg-white font-jakarta">
        <div className="mx-[5vw] flex h-[88px] items-center justify-between ">
          <ProtocolLogo
            black
            onClick={() => {
              props.onClose();
            }}
          />
          <CloseIcon
            className="mr-0.5 h-[14px] w-[14px] fill-black hover:cursor-pointer"
            onClick={props.onClose}
          />
        </div>
        <div className="mx-[15vw] mt-20 mb-10 flex justify-end">
          <Button
            onClick={goToCreateMarket}
            className="hover:bg-light-base hover:text-light-secondary"
          >
            Issue Bond Market
          </Button>
        </div>
        <div className="h-fill mx-[15vw] h-[65vh] overflow-auto overflow-x-hidden border-t border-black pb-20 child:border-b child:border-black">
          {content.map(({ label, content }, i) => (
            <Accordion
              label={label}
              className="py-10 uppercase text-black transition-all hover:bg-black/5"
              iconClassname="fill-black"
              key={i}
            >
              <p className="p-8 text-black">{content}</p>
            </Accordion>
          ))}
        </div>
      </div>
      <Footer closeInfoArea={props.onClose} />
    </div>
  );
};
