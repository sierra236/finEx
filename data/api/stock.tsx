import axios from "axios";

// TODO: Move to env file
const API_KEY = "HvYdrzDoDuwpJoUgc3JqVAyRAy7ZM2WT";
const BASE_URL = "https://financialmodelingprep.com/api/v3";

export const getStockPrices = async (symbols: string[]) => {
  try {
    const res = await axios.get(`${BASE_URL}/quote/${symbols.join(",")}`, {
      params: {
        apikey: API_KEY,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching stock data", err);
    return [];
  }
};
