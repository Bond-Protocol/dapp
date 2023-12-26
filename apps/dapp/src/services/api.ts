import { Token } from "types";
import axios from "axios";

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export const getAllTokens = (tokens: Token[]) => {
  const query = tokens.map((t) => `${t.chainId}:${t.address}`).join(",");

  return axios.get(API_ENDPOINT + "tokens?tokens=" + query);
};

export default {
  getAllTokens,
};
