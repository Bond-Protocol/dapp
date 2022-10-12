import { ReactComponent as GitbookIcon } from "../../assets/icons/socials/gitbook.svg";
import { ReactComponent as GithubIcon } from "../../assets/icons/socials/github.svg";
import { ReactComponent as MediumIcon } from "../../assets/icons/socials/medium.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/socials/twitter.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icons/socials/discord.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/socials/telegram.svg";
import { LinkIcon } from "../../components/atoms/LinkIcon";

export type SocialRowProps = {
  gitbook?: string;
  github?: string;
  medium?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  className?: string;
};

export const SocialRow = (props: SocialRowProps) => {
  return (
    <div
      className={`my-auto flex justify-center gap-9 child:my-auto ${props.className}`}
    >
      {props.gitbook && (
        <LinkIcon href={props.gitbook}>
          <GitbookIcon />
        </LinkIcon>
      )}
      {props.github && (
        <LinkIcon href={props.github}>
          <GithubIcon />
        </LinkIcon>
      )}

      {props.medium && (
        <LinkIcon href={props.medium}>
          <MediumIcon />
        </LinkIcon>
      )}

      {props.twitter && (
        <LinkIcon href={props.twitter} className="hover:text-[#1DA1F2]">
          <TwitterIcon />
        </LinkIcon>
      )}
      {props.discord && (
        <LinkIcon href={props.discord}>
          <DiscordIcon className="hover:text-[#7289da]" />
        </LinkIcon>
      )}
      {props.telegram && (
        <LinkIcon href={props.telegram}>
          <TelegramIcon />
        </LinkIcon>
      )}
    </div>
  );
};
