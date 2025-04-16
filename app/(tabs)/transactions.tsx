import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter, Stack } from "expo-router"; // Stack import unutulmasın
import { Ionicons } from "@expo/vector-icons";

export default function Transactions() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Choose</Text>
          <Text style={styles.title}>Market</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: Colors.tintColor }]}
          onPress={() => router.push("/(markets)/crypto")}
        >
          <View style={styles.cardContent}>
            <Ionicons name="logo-bitcoin" size={30} color={Colors.white} />
            <View>
              <Text style={styles.cardTitle}>Crypto Market</Text>
              <Text style={styles.cardDesc}>Track BTC, ETH, SOL & more</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: Colors.blue }]}
          onPress={() => router.push("/markets/stock")}
        >
          <View style={styles.cardContent}>
            <Ionicons name="trending-up" size={30} color={Colors.white} />
            <View>
              <Text style={styles.cardTitle}>Stock Market</Text>
              <Text style={styles.cardDesc}>Track S&P, Nasdaq & more</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.white,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
});
