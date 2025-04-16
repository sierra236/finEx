import axios from "axios";
import { CRYPTO_IDS } from "@/constants/CryptoList";

export const fetchCryptoData = async () => {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        ids: CRYPTO_IDS.join(","),
        price_change_percentage: "24h",
      },
    }
  );
  return res.data;
};
