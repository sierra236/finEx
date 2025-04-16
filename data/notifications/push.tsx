import * as Notifications from "expo-notifications";

export const sendPriceAlertNotification = async (
  symbol: string,
  change: number
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `\u{1F6A8} ${symbol} moved ${change.toFixed(2)}%`,
      body: "Tap to check the latest change.",
      sound: true,
    },
    trigger: null,
  });
};
