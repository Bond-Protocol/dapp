import { createContext, useContext } from "react";
import { useAuthApi } from "hooks/useAuth";

type AuthContextState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: Function;
  getAccessToken: () => string | null;
};

const initialState = {} as AuthContextState;
export const AuthContext = createContext<AuthContextState>(initialState);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthApi();

  return (
    <AuthContext.Provider
      value={{
        isLoading: !!auth.isLoading,
        signIn: auth.signIn,
        isAuthenticated: !!auth.getAccessToken(),
        getAccessToken: auth.getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
