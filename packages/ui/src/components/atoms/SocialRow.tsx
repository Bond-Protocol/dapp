import CoingeckoIcon from "../../assets/icons/socials/coingecko.svg";
import GitbookIcon from "../../assets/icons/socials/gitbook.svg";
import MediumIcon from "../../assets/icons/socials/medium.svg";
import TwitterIcon from "../../assets/icons/socials/twitter.svg";
import DiscordIcon from "../../assets/icons/socials/discord.svg";
import TelegramIcon from "../../assets/icons/socials/telegram.svg";
import IqIcon from "../../assets/icons/socials/iq.svg";
import { LinkIcon } from "../../components/atoms/LinkIcon";

export type SocialRowProps = {
  homepage?: string;
  coingecko?: string;
  gitbook?: string;
  medium?: string;
  everipedia?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  className?: string;
  width?: number;
};

/**
 * Displays and links supported social networks
 */
export const SocialRow = (props: SocialRowProps) => {
  return (
    <div
      className={`child:my-auto child:select-none my-auto flex ${
        props.className
      } ${props.width ? "gap-4" : "gap-9"}`}
    >
      {props.coingecko && (
        <LinkIcon href={props.coingecko}>
          <img src={CoingeckoIcon} width={props.width} />
        </LinkIcon>
      )}
      {props.gitbook && (
        <LinkIcon href={props.gitbook}>
          <img src={GitbookIcon} width={props.width} />
        </LinkIcon>
      )}

      {props.medium && (
        <LinkIcon href={props.medium}>
          <img src={MediumIcon} width={props.width} />
        </LinkIcon>
      )}

      {props.twitter && (
        <LinkIcon href={props.twitter} className="hover:text-[#1DA1F2]">
          <img src={TwitterIcon} width={props.width} />
        </LinkIcon>
      )}

      {props.discord && (
        <LinkIcon href={props.discord}>
          <img src={DiscordIcon} className="hover:text-[#7289da]" width={props.width} />
        </LinkIcon>
      )}

      {props.telegram && (
        <LinkIcon href={props.telegram}>
          <img src={TelegramIcon} width={props.width} />
        </LinkIcon>
      )}
      {props.everipedia && (
        <LinkIcon href={props.everipedia}>
          <img src={IqIcon} width={props.width} />
        </LinkIcon>
      )}
    </div>
  );
};
