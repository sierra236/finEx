import { useEffect, useState } from "react";
import { fetchCryptoData } from "@/data/api/crypto";

export default function useCryptoMarket(refreshInterval = 10000) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetchCryptoData();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch crypto data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // initial
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval); // cleanup
  }, []);

  return { data, loading };
}
