import { useNavigate } from "react-router-dom";
import { Button, Footer } from "..";
import { Accordion } from "..";
import logo from "../../assets/logo-black.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";

export type InformationAreaProps = {
  onClose: () => void;
  open?: boolean;
};

const content = [
  { label: "How to issue a bond", content: "Coming Soon" },
  { label: "How to get verified", content: "Coming Soon" },
  { label: "How to close an issued bond", content: "Coming Soon" },
  { label: "How to bond", content: "Coming Soon" },
  { label: "Who are we", content: "Coming Soon" },
];

export const InformationArea = (props: InformationAreaProps) => {
  const navigate = useNavigate();

  const goToCreateMarket = () => {
    props.onClose();
    navigate("/create");
  };

  return (
    <div
      className={`inset-0 absolute h-[100vh] bg-turtle-blue transition-transform z-10 ${
        props.open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="bg-white">
        <div className="mx-[5vw] h-[88px] flex justify-between items-center ">
          <img src={logo} />
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
        <div className="mx-[15vw] child:border-b child:border-black border-t border-black overflow-auto overflow-x-hidden h-fill h-[65vh]">
          {content.map(({ label, content }, i) => (
            <Accordion
              label={label}
              className="text-black py-10 hover:bg-black/5 transition-all"
              key={i}
            >
              <p className="p-8">{content}</p>
            </Accordion>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
