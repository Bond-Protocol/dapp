import { GeneralTermsDialog } from "components/modals";
import { useState } from "react";
import useBrowserStorage from "../../hooks/useBrowserStorage";
import { Modal } from "../molecules/Modal";

/**
 * Renders the T&C modal if the user hasn't them accepted yet (see TermsDialog component)
 * renders children otherwise
 */
export const RequireTermsAndConditions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getItem } = useBrowserStorage();
  const tc = getItem("tc");
  const { accepted } = (tc && JSON.parse(getItem("tc"))) || false;
  const [hasAccepted, setAccepted] = useState(accepted);

  if (accepted) return children;
  return (
    <Modal open={!hasAccepted}>
      <GeneralTermsDialog onAccept={() => setAccepted(true)} />
    </Modal>
  );
};
