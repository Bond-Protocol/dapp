import { Button } from "ui";
import { useOrderApi } from "./use-order-api";

export const ApiTestElement = () => {
  const api = useOrderApi();

  return (
    <div>
      <Button onClick={api.signIn}>Sign in</Button>
    </div>
  );
};
