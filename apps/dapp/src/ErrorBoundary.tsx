import { AppBackdrop } from "components/common/AppBackdrop";
import { Component, ErrorInfo, ReactNode } from "react";
import { socials } from "./components";
import { Link, ProtocolLogo } from "ui";
import { environment } from "./environment";

const fallbackEmoji = "https://cdn3.emoji.gg/emojis/PepeRain.gif";
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const DevError = ({ error, errorInfo }: any) => {
  return (
    <div className="m-auto flex w-[50%] flex-col place-items-center justify-center border-4 border-light-primary p-8">
      <img src="https://media.tenor.com/Q0pWc115TqsAAAAd/shit-shet.gif" />
      <p className="text-lg text-light-alert">
        {error?.name}: {error?.message}
      </p>
      <div className="mt-4 text-left text-xs">{errorInfo?.componentStack}</div>
    </div>
  );
};

const ProdError = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-xl">
      <ProtocolLogo />
      <div className="mt-4 flex gap-x-2">
        Ooops, something went wrong <img width={32} src={fallbackEmoji} />
      </div>

      <p>Try refreshing this page</p>
      <div className="mt-4 flex items-end text-sm text-light-grey">
        If the problem persists please create a support ticket in our{" "}
        <Link
          className="ml-1 inline cursor-pointer pb-[1px] text-[#7289da]"
          href={socials.discord}
        >
          {" "}
          Discord Server
        </Link>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState((state) => {
      return { ...state, error, errorInfo };
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div id="__BOND_ERROR_PAGE" className="h-[100vh] w-full">
          <AppBackdrop />
          <div className="h-[100vh] w-full flex-col items-center p-8 text-center">
            {environment.isProduction ? (
              <ProdError />
            ) : (
              <DevError {...this.state} />
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
