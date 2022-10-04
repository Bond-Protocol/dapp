import { useNavigate } from "react-router-dom";
import { Accordion, Button, Footer } from "..";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";
import { ProtocolLogo } from "components/atoms/ProtocolLogo";

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
      className={`inset-0 fixed h-[100vh] duration-500 bg-turtle-blue transition-transform z-10 ${
        props.open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="bg-white h-[90vh] font-jakarta">
        <div className="mx-[5vw] h-[88px] flex justify-between items-center ">
          <ProtocolLogo
            black
            onClick={() => {
              props.onClose();
              console.log("haiii");
            }}
          />
          <CloseIcon
            className="fill-black hover:cursor-pointer w-[14px] h-[14px] mr-0.5"
            onClick={props.onClose}
          />
        </div>
        <div className="mt-20 mb-10 mx-[15vw] flex justify-end">
          <Button
            onClick={goToCreateMarket}
            className="hover:bg-brand-turtle-blue hover:text-brand-yella"
          >
            Issue Bond Market
          </Button>
        </div>
        <div className="mx-[15vw] pb-20 child:border-b child:border-black border-t border-black overflow-auto overflow-x-hidden h-fill h-[65vh]">
          {content.map(({ label, content }, i) => (
            <Accordion
              label={label}
              className="text-black py-10 hover:bg-black/5 transition-all"
              iconClassname="fill-black"
              key={i}
            >
              <p className="p-8 text-black">{content}</p>
            </Accordion>
          ))}
        </div>
      </div>
      <Footer closeInfoArea={props.onClose} className="bg-brand-turtle-blue" />
    </div>
  );
};
