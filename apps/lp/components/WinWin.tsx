import { LinkButton } from "./LinkButton";

export const WinWin = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      <div className="font-fraktion text-center text-5xl uppercase">
        {"A Win-Win for All"}
      </div>
      <div className="text-grey-500 pt-2 pb-8 text-center">
        {"Bond protocol allows all parties to win and create stronger products"}
      </div>
      <img src="/winwin.svg" className="fml:hidden mx-auto" />
      <img src="/winwin-long.svg" className="xs:hidden fml:block" />
      <div className="mx-auto flex flex-col justify-center gap-2 pt-12 lg:flex-row">
        <LinkButton
          href="https://app.bondprotocol.finance/#/create"
          size="lg"
          thin={false}
        >
          {"Issue Bonds"}
        </LinkButton>
        <LinkButton
          href="https://app.bondprotocol.finance/#/markets"
          size="lg"
          thin={false}
          variant="ghost"
        >
          {"Find Bonds"}
        </LinkButton>
      </div>
    </div>
  );
};
