import React from "react";
import { Modal } from "../components/molecules";

export const blockExplorerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export const ModalDecorator = (Story: any) => (
  <Modal title={"Modal Title"} open={true} onClickClose={() => {}}>
    <Story />
  </Modal>
);
