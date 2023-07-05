import { MarketList } from "components/lists";
import { useSearchParams } from "react-router-dom";
import { useEmbedContext } from "./embed-context";

export const EmbeddedMarkets = () => {
  const [params] = useSearchParams();
  const { ownerAddress } = useEmbedContext();

  const owner = params.get("owner") ?? ownerAddress;

  return (
    <div>
      <MarketList owner={owner} />
    </div>
  );
};
