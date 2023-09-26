import { useAuth } from "context/auth-provider";
import { Button } from "ui";
import { useOrderApi } from "./use-order-api";

export const ApiTestElement = () => {
  const auth = useAuth();

  return (
    <div>
      <Button onClick={() => auth.signIn()}>Sign in</Button>
    </div>
  );
};
