import githubIcon from "../../assets/icons/socials/github.svg";
import mediumIcon from "../../assets/icons/socials/medium.svg";
import twitterIcon from "../../assets/icons/socials/twitter.svg";
import discordIcon from "../../assets/icons/socials/discord.svg";
import { LinkIcon } from "../../components/atoms/LinkIcon";

export type SocialRowProps = {
  github?: string;
  medium?: string;
  twitter?: string;
  discord?: string;
  className?: string;
};

export const SocialRow = (props: SocialRowProps) => {
  return (
    <div
      className={`flex justify-center gap-9 child:my-auto ${props.className}`}
    >
      {props.github && <LinkIcon src={githubIcon} href={props.github} />}
      {props.medium && <LinkIcon src={mediumIcon} href={props.medium} />}
      {props.twitter && <LinkIcon src={twitterIcon} href={props.twitter} />}
      {props.discord && <LinkIcon src={discordIcon} href={props.discord} />}
    </div>
  );
};
