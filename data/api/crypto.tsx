import axios from "axios";

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";

export const getCryptoPrices = async (
  assets = [
    "bitcoin",
    "ethereum",
    "ripple",
    "solana",
    "litecoin",
    "dogecoin",
    "polkadot",
    "cardano",
    "chainlink",
    "uniswap",
  ],
  currency = "usd"
) => {
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: assets.join(","),
        vs_currencies: currency,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return null;
  }
};
