import { default as NextHead } from "next/head";

export interface MetaTagsProps {
  description: string;
  title: string;
  type?: string;
  image?: string;
  url?: string;
  siteName?: string;
  twitterImgAlt?: string;
  twitterHandle?: string;
}

export const MetaTags = (props: MetaTagsProps) => {
  return (
    <>
      <meta name="description" content={props.description} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:type" content={props.type} />
      <meta property="og:image" content={props.image} />
      <meta property="og:url" content={props.url} />
      <meta property="og:site_name" content={props.siteName} />
      <meta name="twitter:image:alt" content={props.twitterImgAlt} />
      <meta name="twitter:site" content={props.twitterHandle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="index,follow" />
    </>
  );
};

export const Head = (props: MetaTagsProps) => (
  <NextHead>
    <title>{props.title}</title>
    <MetaTags {...props} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </NextHead>
);
