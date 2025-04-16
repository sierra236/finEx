import axios from "axios";
import { STOCK_SYMBOLS } from "@/constants/StockList";

const API_KEY = "HvYdrzDoDuwpJoUgc3JqVAyRAy7ZM2WT"; // TODO: replace with .env later
const BASE_URL = "https://financialmodelingprep.com/api/v3";

export const fetchStockData = async () => {
  const res = await axios.get(`${BASE_URL}/quote/${STOCK_SYMBOLS.join(",")}`, {
    params: {
      apikey: API_KEY,
    },
  });
  return res.data;
};
