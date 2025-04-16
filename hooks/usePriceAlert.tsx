import { useEffect } from "react";
import { sendPriceAlertNotification } from "@/data/notifications/push";

export const usePriceAlert = (data: any[], threshold = 2) => {
  useEffect(() => {
    if (!data || data.length === 0) return;
    data.forEach((item) => {
      const change = item.price_change_percentage_24h ?? item.changesPercentage;

      if (Math.abs(change) >= threshold) {
        sendPriceAlertNotification(item.name ?? item.symbol, change);
      }
    });
  }, [data]);
};
