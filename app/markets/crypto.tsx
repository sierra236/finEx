import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CRYPTO_IDS } from "@/constants/CryptoList";
import { usePriceAlert } from "@/hooks/usePriceAlert";
import { getFavoriteCoins, toggleFavoriteCoin } from "@/data/storage/favorites";
import axios from "axios";

export default function CryptoMarket() {
  const [coins, setCoins] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  usePriceAlert(coins);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [favIds, res] = await Promise.all([
          getFavoriteCoins(),
          axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
              vs_currency: "usd",
              ids: CRYPTO_IDS.join(","),
              price_change_percentage: "24h",
            },
          }),
        ]);

        setFavorites(favIds);
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching crypto data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const change = item.price_change_percentage_24h;
    const isPositive = change >= 0;
    const isZero = change === 0;

    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.price}>${item.current_price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            const updated = await toggleFavoriteCoin(item.id);
            setFavorites(updated);
          }}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={20}
            color="#facc15"
            style={{ marginRight: 12 }}
          />
        </TouchableOpacity>
        <View style={styles.changeBlock}>
          <Ionicons
            name={isZero ? "remove" : isPositive ? "arrow-up" : "arrow-down"}
            size={16}
            color={isZero ? "#aaa" : isPositive ? "#4caf50" : "#ef5350"}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.changeText,
              { color: isZero ? "#aaa" : isPositive ? "#4caf50" : "#ef5350" },
            ]}
          >
            {change?.toFixed(2)}%
          </Text>
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
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
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
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  coinName: {
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
  changeBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
