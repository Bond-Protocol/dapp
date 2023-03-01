import { PropsWithChildren } from "react";
import { meme } from "src/utils/words";
import { Loading } from "ui";

export const LoadingIndicator = (
  props: PropsWithChildren<{ loading: boolean }>
) => {
  if (!props.loading) return <>{props.children}</>;

  return <Loading content={meme()} />;
};
