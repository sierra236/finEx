import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  Image,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";
import axios from "axios";

export default function CoinDetail() {
  const { id } = useLocalSearchParams();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((res) => setCoin(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !coin) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.white}
        style={{ marginTop: 100 }}
      />
    );
  }

  const image = coin?.image?.large;
  const symbol = coin?.symbol?.toUpperCase();
  const price = coin?.market_data?.current_price?.usd;
  const marketCap = coin?.market_data?.market_cap?.usd;
  const volume = coin?.market_data?.total_volume?.usd;
  const homepage = coin?.links?.homepage?.[0];
  const description = coin?.description?.en;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {image && <Image source={{ uri: image }} style={styles.logo} />}
        <Text style={styles.name}>{coin.name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>

      {price !== undefined && (
        <Text style={styles.info}>Price: ${price.toLocaleString()}</Text>
      )}

      {marketCap !== undefined && (
        <Text style={styles.info}>
          Market Cap: ${marketCap.toLocaleString()}
        </Text>
      )}

      {volume !== undefined && (
        <Text style={styles.info}>
          Volume (24h): ${volume.toLocaleString()}
        </Text>
      )}

      {homepage && homepage !== "" && (
        <Text onPress={() => Linking.openURL(homepage)} style={styles.link}>
          Visit Website
        </Text>
      )}

      {description && (
        <Text style={styles.description}>
          {description.replace(/<[^>]+>/g, "").slice(0, 500)}...
        </Text>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
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
