import { useIsEmbed } from "hooks/useIsEmbed";
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

const initialState = {
  ownerAddress: "",
};

interface IEmbedContext {
  /** A market creator address used to filter the markets displayed in an embed*/
  ownerAddress: string;
  /** Whether the app is being embedded*/
  isEmbed: boolean;
}

const EmbedContext = createContext(initialState as IEmbedContext);

export const useEmbedContext = () => {
  return useContext(EmbedContext);
};

export const EmbedProvider = ({ children }: { children: React.ReactNode }) => {
  const isEmbed = useIsEmbed();
  const [search] = useSearchParams();
  const [ownerAddress] = useState(search.get("owner") ?? "");

  return (
    <EmbedContext.Provider value={{ ownerAddress, isEmbed }}>
      {children}
    </EmbedContext.Provider>
  );
};
