import { createContext, useContext } from "react";
import { useOrderApi } from "services/limit-order/use-order-api";

type AuthContextState = {
  isAuthenticated: boolean;
  signIn: Function;
};

const initialState = {} as AuthContextState;
export const AuthContext = createContext<AuthContextState>(initialState);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useOrderApi();

  return (
    <AuthContext.Provider
      value={{
        signIn: auth.signIn,
        isAuthenticated: !!auth.getAccessToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
