import { Icon } from "ui";
import arbitrum from "assets/icons/arbitrum.svg";
import repeatIcon from "assets/icons/loop.svg";
import { getIconsForChains } from "src/utils/get-icons-for-chains";

type ChainButtonProps = {
  onClick: () => void;
  iconWidth?: number;
  chain: {
    id?: number;
    name?: string;
    iconUrl?: string;
  };
};
export const ChainButton = ({ iconWidth = 32, ...props }: ChainButtonProps) => {
  const { logoUrl } = getIconsForChains(props.chain);

  return (
    <div onClick={props.onClick}>
      <Icon
        width={iconWidth}
        height={iconWidth}
        className="hover:cursor-pointer"
        alt={props.chain.name ?? "Chain icon"}
        src={
          props.chain.id === 421613 //TODO: remove goerli arb icon hack
            ? arbitrum
            : props.chain.iconUrl ?? logoUrl ?? repeatIcon
        }
      />
    </div>
  );
};
