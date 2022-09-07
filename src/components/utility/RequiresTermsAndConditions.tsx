import useBrowserStorage from "hooks/useBrowserStorage";
import { Modal } from "../molecules/Modal";
import { TermsDialog } from "../modals/TermsDialog";

export const RequireTermsAndConditions = (props: {
  children: React.ReactNode;
}) => {
  const { getItem } = useBrowserStorage();
  const tc = getItem("tc");
  const accepted = (tc && JSON.parse(getItem("tc"))) || false;

  if (accepted) return props.children;

  return (
    <Modal open={true}>
      <TermsDialog />
    </Modal>
  );
};
