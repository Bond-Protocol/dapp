import { useMediaQuery } from "react-responsive";

export const useMediaQueries = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 530px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return {
    isMobile,
    isTabletOrMobile,
  };
};
