/** Generates a fetcher function from a url, useful for react-query
 * @param url - the query url
 */
export const generateFetcher = (url: string) => {
  return async () => {
    const result = await fetch(url);
    return result.json();
  };
};
