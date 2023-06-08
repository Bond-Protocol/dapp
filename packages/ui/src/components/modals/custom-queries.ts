export const generateFetcher = (url: string, args?: any) => {
  return async () => {
    try {
      let result = await fetch(url, args);
      return (await result?.json()) ?? {};
    } catch (e) {
      console.error(`Failed to fetch ${url}`, e);
    }
  };
};

export const generateGraphqlQuery = (
  query: string,
  endpoint: string,
  variables = {}
) => {
  return generateFetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
};
