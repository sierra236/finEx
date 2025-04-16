import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "FAVORITE_COINS";

export const getFavoriteCoins = async (): Promise<string[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const toggleFavoriteCoin = async (id: string): Promise<string[]> => {
  const current = await getFavoriteCoins();
  const updated = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const isCoinFavorite = async (id: string): Promise<boolean> => {
  const current = await getFavoriteCoins();
  return current.includes(id);
};
