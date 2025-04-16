import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { fetchStockData } from "@/data/api/stock";
import { STOCK_SYMBOLS } from "@/constants/StockList";
import { usePriceAlert } from "@/hooks/usePriceAlert";
import { getFavoriteCoins, toggleFavoriteCoin } from "@/data/storage/favorites";

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

export default function StockMarket() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteStocks, setFavoriteStocks] = useState<any[]>([]);

  usePriceAlert(stocks);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStockData();
      setStocks(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateFavorites = async () => {
      const ids = await getFavoriteCoins();
      setFavorites(ids);
      setFavoriteStocks(
        stocks.filter((s) => ids.includes(s.symbol.toLowerCase()))
      );
    };

    updateFavorites();
  }, [stocks]);

  const renderItem = ({ item }: { item: any }) => {
    const domain = COMPANY_DOMAINS[item.symbol];
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    const change = item.changesPercentage;
    const isPositive = change >= 0;
    const isFav = favorites.includes(item.symbol.toLowerCase());

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.stockName}>{item.name ?? item.symbol}</Text>
          <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
        </View>
        <View style={styles.rightSide}>
          <View style={styles.changeBlock}>
            <Ionicons
              name={isPositive ? "arrow-up" : "arrow-down"}
              size={16}
              color={isPositive ? "#4caf50" : "#ef5350"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.changeText,
                { color: isPositive ? "#4caf50" : "#ef5350" },
              ]}
            >
              {change?.toFixed(2)}%
            </Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              const updated = await toggleFavoriteCoin(
                item.symbol.toLowerCase()
              );
              setFavorites(updated);
              setFavoriteStocks(
                stocks.filter((s) => updated.includes(s.symbol.toLowerCase()))
              );
            }}
          >
            <Ionicons
              name={isFav ? "star" : "star-outline"}
              size={18}
              color="#facc15"
              style={{ marginTop: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.white} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoriteStocks.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Favorites</Text>
              {favoriteStocks.map((item) => (
                <View key={`fav-${item.symbol}`}>{renderItem({ item })}</View>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>All Stocks</Text>
          {stocks
            .filter((s) => !favorites.includes(s.symbol.toLowerCase()))
            .map((item) => (
              <View key={`stock-${item.symbol}`}>{renderItem({ item })}</View>
            ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  stockName: {
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
  rightSide: {
    alignItems: "flex-end",
  },
  changeBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 10,
    marginTop: 20,
  },
});
