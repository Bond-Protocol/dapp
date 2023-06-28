import axios from "axios";
import { useState } from "react";

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export const useBondPurchases = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getBondPurchases = async (id: string) => {
    setIsLoading(true);

    try {
      const result = await axios.get(
        API_ENDPOINT + `markets/${id}/bondPurchases`
      );
      setIsLoading(false);
      return result.data;
    } catch (e) {
      console.error(`Failed to load bond purchases for ${id}`, e);
    }
  };

  return {
    getBondPurchases,
    isLoading,
  };
};
