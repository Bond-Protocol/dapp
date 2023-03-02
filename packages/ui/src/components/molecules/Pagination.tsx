import { ReactComponent as CaretDown } from "../../assets/icons/select-arrow-down.svg";
import { Icon } from "..";

export const PaginationSelector = (props: {
  value: number;
  currentPage: number;
  onClickPage: (num: number) => void;
  className?: string;
}) => {
  const isSelected = props.value === props.currentPage;
  const selectedStyle =
    "border-light-secondary text-light-secondary rounded-lg border";

  const handleClick = () => props.onClickPage(props.value);

  return (
    <div
      onClick={handleClick}
      className={`flex h-8 w-8 max-w-[32px] cursor-pointer select-none items-center justify-center p-1 text-center text-[14px] hover:rounded-lg hover:border ${
        isSelected && selectedStyle
      } ${props.className} `}
    >
      {props.value + 1}
    </div>
  );
};

export type PaginationProps = {
  className?: string;
  totalPages: number;
  selectedPage: number;
  handleChangePage: (page: number) => void;
  onSeeAll: (e: React.BaseSyntheticEvent) => void;
  isShowingAll?: boolean;
};

export const Pagination = ({
  className,
  totalPages,
  selectedPage,
  handleChangePage,
  onSeeAll,
  isShowingAll,
}: PaginationProps) => {
  const elements = Array(totalPages)
    .fill(null)
    .map((_e, i) => {
      const thisPage = i;

      const showCurrentSelector = (() => {
        //Disable the first separator while at first pages
        if (selectedPage <= 3 && thisPage <= 4) {
          return true;
        }

        //Disable the last separator while at last pages
        if (selectedPage >= totalPages - 4 && thisPage >= totalPages - 5) {
          return true;
        }

        return (
          thisPage === 0 ||
          thisPage === selectedPage - 1 ||
          thisPage === selectedPage ||
          thisPage === selectedPage + 1 ||
          thisPage === totalPages - 1
        );
      })();

      const showAsSeparator = (() => {
        //Force the last separator position during first pages
        if (selectedPage <= 2 && thisPage === 5) return true;
        //Force the first separator position during last pages
        if (selectedPage >= totalPages - 3 && thisPage === totalPages - 6)
          return true;

        if (showCurrentSelector) return false;

        return thisPage === selectedPage - 2 || thisPage === selectedPage + 2;
      })();

      if (showAsSeparator && totalPages > 7) {
        return <div className={"mx-2.5 w-3 border-b border-dashed "} />;
      }

      return (
        <PaginationSelector
          key={thisPage}
          value={thisPage}
          currentPage={selectedPage}
          onClickPage={handleChangePage}
          className={!showCurrentSelector && totalPages > 7 ? "hidden" : ""}
        />
      );
    });

  const isFirstPage = selectedPage === 0;
  const isLastPage = selectedPage === totalPages - 1;

  return (
    <div className={`w-full ${className}`}>
      {!isShowingAll && (
        <div className="flex justify-center gap-x-0.5">
          <Icon
            className={
              !isFirstPage
                ? "cursor-pointer rounded-lg hover:border"
                : "text-white/30"
            }
            onClick={() => !isFirstPage && handleChangePage(selectedPage - 1)}
          >
            {<CaretDown className="rotate-90" />}
          </Icon>
          {elements}
          <Icon
            className={
              !isLastPage
                ? "cursor-pointer rounded-lg hover:border"
                : "text-white/30"
            }
            onClick={() => !isLastPage && handleChangePage(selectedPage + 1)}
          >
            <CaretDown className="-rotate-90" />
          </Icon>
        </div>
      )}
      <div
        className="mt-1 cursor-pointer select-none text-center font-mono text-[14px] uppercase hover:underline"
        onClick={onSeeAll}
      >
        {isShowingAll ? "See Less" : "See All"}
      </div>
    </div>
  );
};
