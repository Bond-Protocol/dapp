import { useAuth } from "context/auth-provider";
import { Button } from "ui";
import { useOrderApi } from "./use-order-api";

export const ApiTestElement = () => {
  const auth = useAuth();
  const api = useOrderApi();

  return (
    <div>
      <Button onClick={() => auth.signIn()}>Sign in</Button>
      <Button onClick={() => api.createOrder({})}>Create Order</Button>
      <Button variant="secondary" onClick={api.signIn}>
        Cancel Order
      </Button>
    </div>
  );
};
