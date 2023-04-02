import { ModalHeader, ModalBackground } from "../components/molecules";

export const blockExplorerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export const ModalDecorator = (Story: any) => (
  <div className="w-min min-w-[512px]">
    <ModalBackground>
      <ModalHeader topLeftContent={"A Modal Title"} onClickClose={() => {}} />
      <div className="text-light-secondary-10 px-5 pb-6 transition-all">
        <Story />
      </div>
    </ModalBackground>
  </div>
);
