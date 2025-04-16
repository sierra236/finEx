import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import axios from "axios";

const CRYPTO_IDS = ["bitcoin", "ethereum", "solana", "dogecoin", "cardano"];

export default function CryptoMarket() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: CRYPTO_IDS.join(","),
            },
          }
        );
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching coin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.coinName}>{item.name}</Text>
        <Text style={styles.price}>${item.current_price}</Text>
      </View>
    </View>
  );

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
});
