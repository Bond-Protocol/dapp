import gitbook from "../../assets/icons/socials/gitbook.svg";
import github from "../../assets/icons/socials/github.svg";
import medium from "../../assets/icons/socials/medium.svg";
import twitter from "../../assets/icons/socials/twitter.svg";
import discord from "../../assets/icons/socials/discord.svg";
import telegram from "../../assets/icons/socials/telegram.svg";

import { LinkIcon } from "../../components/atoms/LinkIcon";
import { Icon } from "../../components/Icon";

export type SocialRowProps = {
  gitbook?: string;
  github?: string;
  medium?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  className?: string;
  width?: number;
};

export const SocialRow = (props: SocialRowProps) => {
  return (
    <div
      className={`child:my-auto child:select-none my-auto flex ${
        props.className
      } ${props.width ? "gap-4" : "gap-9"}`}
    >
      {props.gitbook && (
        <LinkIcon href={props.gitbook}>
          <Icon src={gitbook} width={props.width} />
        </LinkIcon>
      )}

      {props.github && (
        <LinkIcon href={props.github}>
          <Icon src={github} width={props.width} />
        </LinkIcon>
      )}

      {props.medium && (
        <LinkIcon href={props.medium}>
          <Icon src={medium} width={props.width} />
        </LinkIcon>
      )}

      {props.twitter && (
        <LinkIcon href={props.twitter} className="hover:text-[#1DA1F2]">
          <Icon src={twitter} width={props.width} />
        </LinkIcon>
      )}

      {props.discord && (
        <LinkIcon href={props.discord}>
          <Icon
            src={discord}
            className="hover:text-[#7289da]"
            width={props.width}
          />
        </LinkIcon>
      )}

      {props.telegram && (
        <LinkIcon href={props.telegram}>
          <Icon src={telegram} width={props.width} />
        </LinkIcon>
      )}
    </div>
  );
};
