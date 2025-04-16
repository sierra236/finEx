import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import Colors from "@/constants/Colors";
import axios from "axios";

const API_KEY = "HvYdrzDoDuwpJoUgc3JqVAyRAy7ZM2WT";

export default function StockDetail() {
  const { symbol } = useLocalSearchParams();
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`
        );
        setStock(res.data[0]);
      } catch (err) {
        console.error("Stock fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading || !stock) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.white}
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{stock.companyName}</Text>
      <Text style={styles.symbol}>{stock.symbol}</Text>
      <Text style={styles.info}>Price: ${stock.price}</Text>
      <Text style={styles.info}>Market Cap: ${stock.mktCap}</Text>
      <Text style={styles.info}>Exchange: {stock.exchange}</Text>

      {stock.website && (
        <Text
          onPress={() => Linking.openURL(stock.website)}
          style={styles.link}
        >
          Visit Website
        </Text>
      )}

      {stock.description && (
        <Text style={styles.description}>{stock.description}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
  },
  symbol: {
    color: "#aaa",
    marginBottom: 10,
    fontSize: 14,
  },
  info: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  link: {
    color: "#4ca7ec",
    marginTop: 16,
    fontWeight: "bold",
  },
  description: {
    color: Colors.white,
    marginTop: 24,
    lineHeight: 20,
    fontSize: 14,
    opacity: 0.9,
  },
});
