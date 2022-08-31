/**
 * Tries to determine the user's language
 */
export const getUserLocale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
};
