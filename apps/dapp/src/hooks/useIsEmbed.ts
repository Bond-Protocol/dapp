export const useIsEmbed = () => {
  return window.self !== window.top;
};
