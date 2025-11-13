import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logo} />

      <Text style={styles.title}>Bem-vindo à Lunaria</Text>
      <Text style={styles.subtitle}>Moedas recentes</Text>

      <View style={styles.coinList}>
        <View style={styles.coinItem}>
          <Text style={styles.coinSymbol}>BTC</Text>
          <Text style={styles.coinPrice}>
            $63k <Text style={styles.up}>+4.32%</Text>
          </Text>
        </View>

        <View style={styles.coinItem}>
          <Text style={styles.coinSymbol}>ETH</Text>
          <Text style={styles.coinPrice}>
            $43k <Text style={styles.down}>-2.12%</Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>Gerenciar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#5c1a75",
    marginBottom: 20,
  },
  title: { fontSize: 22, color: "#fff", marginBottom: 6, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#ccc", marginBottom: 20 },
  coinList: { width: "100%", maxWidth: 350, marginBottom: 20 },
  coinItem: {
    backgroundColor: "#1a001f",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  coinSymbol: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  coinPrice: { color: "#fff", fontSize: 16 },
  up: { color: "#2ecc71", fontWeight: "bold" },
  down: { color: "#e74c3c", fontWeight: "bold" },
  buttons: { width: "100%", maxWidth: 350, marginTop: 10 },
  button: {
    backgroundColor: "#4b006e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
