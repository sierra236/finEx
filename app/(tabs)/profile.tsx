import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { getFavoriteCoins } from "@/data/storage/favorites";
import { fetchStockData } from "@/data//api/stock";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { CRYPTO_IDS } from "@/constants/CryptoList";

const COMPANY_DOMAINS: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "google.com",
  AMZN: "amazon.com",
  META: "meta.com",
  TSLA: "tesla.com",
  NFLX: "netflix.com",
  NVDA: "nvidia.com",
};

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const ids = await getFavoriteCoins();
      const cryptoIds = ids.filter((id) => CRYPTO_IDS.includes(id));
      const stockSymbols = ids
        .filter((id) => !CRYPTO_IDS.includes(id))
        .map((id) => id.toUpperCase());

      const [cryptoRes, stockRes] = await Promise.all([
        cryptoIds.length > 0
          ? axios.get("https://api.coingecko.com/api/v3/coins/markets", {
              params: {
                vs_currency: "usd",
                ids: cryptoIds.join(","),
              },
            })
          : Promise.resolve({ data: [] }),
        stockSymbols.length > 0 ? fetchStockData() : Promise.resolve([]),
      ]);

      const cryptoData = cryptoRes.data;
      const stockData = stockRes.filter((s) =>
        ids.includes(s.symbol.toLowerCase())
      );
      const merged = [...cryptoData, ...stockData];
      setFavorites(merged);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Favorites</Text>
        {favorites.map((item) => {
          const isStock = !!item.symbol && !item.id;
          const name = item.name ?? item.symbol;
          const price = item.current_price ?? item.price;
          const logo = isStock
            ? `https://logo.clearbit.com/${COMPANY_DOMAINS[item.symbol]}`
            : item.image;

          return (
            <View style={styles.card} key={item.id ?? item.symbol}>
              <Image
                source={{ uri: logo }}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}>${price?.toFixed(2)}</Text>
              </View>
              <Ionicons name="star" size={20} color="#facc15" />
            </View>
          );
        })}
        {favorites.length === 0 && !loading && (
          <Text style={styles.empty}>No favorites yet ⭐</Text>
        )}
      </ScrollView>
    </>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: Colors.black,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  name: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  empty: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
