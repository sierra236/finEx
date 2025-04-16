import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CRYPTO_IDS } from "@/constants/CryptoList";
import { getFavoriteCoins, toggleFavoriteCoin } from "@/data/storage/favorites";
import axios from "axios";

export default function CryptoMarket() {
  const priceColorAnim = useRef<Record<string, Animated.Value>>(
    Object.fromEntries(CRYPTO_IDS.map((id) => [id, new Animated.Value(0)]))
  ).current;
  const [coins, setCoins] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFlashes, setPriceFlashes] = useState<
    Record<string, "up" | "down" | null>
  >({});

  // 🎨 animasyon değerlerini useRef ile tut

  useEffect(() => {
    const loadData = async () => {
      try {
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
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          Alert.alert(
            "Rate Limit Reached",
            "Too many requests to CoinGecko. Please wait a bit."
          );
        } else {
          console.error("Initial crypto data fetch error", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const priceInterval = setInterval(async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: CRYPTO_IDS.join(","),
              price_change_percentage: "24h",
            },
          }
        );

        setCoins((prevCoins) => {
          const updatedCoins = prevCoins.map((coin) => {
            const updated = res.data.find((c: any) => c.id === coin.id);
            if (!updated) return coin;

            const newPrice = updated.current_price;
            const oldPrice = coin.current_price;

            if (newPrice > oldPrice || newPrice < oldPrice) {
              const direction = newPrice > oldPrice ? "up" : "down";
              setPriceFlashes((prev) => ({ ...prev, [coin.id]: direction }));

              Animated.sequence([
                Animated.timing(priceColorAnim[coin.id], {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }),
                Animated.timing(priceColorAnim[coin.id], {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }),
              ]).start();
            }

            return { ...coin, current_price: newPrice };
          });

          return updatedCoins;
        });
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          console.warn("Too many requests to CoinGecko API.");
        } else {
          console.error("Real-time price fetch failed:", err);
        }
      }
    }, 30000); // ⏱️ 30 saniyede bir

    return () => clearInterval(priceInterval);
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const change = item.price_change_percentage_24h;
    const isPositive = change >= 0;
    const isZero = change === 0;
    const isFavorite = favorites.includes(item.id);

    const animatedColor = priceColorAnim[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: [
        Colors.white,
        priceFlashes[item.id] === "up" ? "#4caf50" : "#ef5350",
      ],
    });

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.logo} />
        <View style={{ flex: 1 }}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Animated.Text style={[styles.price, { color: animatedColor }]}>
            ${item.current_price.toFixed(2)}
          </Animated.Text>
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
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
    fontWeight: "500",
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
