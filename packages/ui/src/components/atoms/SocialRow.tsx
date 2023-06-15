import { ReactComponent as GitbookIcon } from "../../assets/icons/socials/gitbook.svg";
import { ReactComponent as GithubIcon } from "../../assets/icons/socials/github.svg";
import { ReactComponent as MediumIcon } from "../../assets/icons/socials/medium.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/socials/twitter.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icons/socials/discord.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/socials/telegram.svg";
import { ReactComponent as IqIcon } from "../../assets/icons/socials/iq.svg";
import { LinkIcon } from "../../components/atoms/LinkIcon";
import { useEffect, useState } from "react";

export type SocialRowProps = {
  gitbook?: string;
  github?: string;
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
  const [everipedia, setEveripedia] = useState<string>();

  useEffect(() => {
    if (!props.everipedia) return;
    const resolveEveripedia = async () => {
      // @ts-ignore
      const res = await fetch(props.everipedia);
      const reader = res?.body?.getReader();
      const data = await reader?.read();
      if (!data?.value) return;
      const value = Buffer.from(data.value).toString("utf-8");
      if (value === "[]") return;
      setEveripedia(value.substring(2, value.length - 2));
    };
    resolveEveripedia();
  }, [props.everipedia]);

  return (
    <div
      className={`child:my-auto child:select-none my-auto flex ${
        props.className
      } ${props.width ? "gap-4" : "gap-9"}`}
    >
      {props.gitbook && (
        <LinkIcon href={props.gitbook}>
          <GitbookIcon width={props.width} />
        </LinkIcon>
      )}

      {props.github && (
        <LinkIcon href={props.github}>
          <GithubIcon width={props.width} />
        </LinkIcon>
      )}

      {props.medium && (
        <LinkIcon href={props.medium}>
          <MediumIcon width={props.width} />
        </LinkIcon>
      )}

      {props.twitter && (
        <LinkIcon href={props.twitter} className="hover:text-[#1DA1F2]">
          <TwitterIcon width={props.width} />
        </LinkIcon>
      )}

      {props.discord && (
        <LinkIcon href={props.discord}>
          <DiscordIcon className="hover:text-[#7289da]" width={props.width} />
        </LinkIcon>
      )}

      {props.telegram && (
        <LinkIcon href={props.telegram}>
          <TelegramIcon width={props.width} />
        </LinkIcon>
      )}
      {everipedia && (
        <LinkIcon href={everipedia}>
          <IqIcon width={props.width} />
        </LinkIcon>
      )}
    </div>
  );
};
