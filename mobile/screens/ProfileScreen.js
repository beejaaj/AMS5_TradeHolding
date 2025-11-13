import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ alignSelf: "flex-start", marginBottom: 16 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#fff" }}>◀ Voltar</Text>
      </TouchableOpacity>

      <View style={styles.profileCard}>
        <View style={styles.profileImage} />
        <Text style={styles.title}>Exemplo</Text>

        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Nome:</Text>
          <Text style={styles.fieldValue}>Exemplo da Silva Junior</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>exemplo@email.com</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Telefone:</Text>
          <Text style={styles.fieldValue}>0982183...</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldLabel}>Endereço:</Text>
          <Text style={styles.fieldValue}>Rua Jalim 56, Rabel, SP</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mudar sua senha</Text>
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
  title: { fontSize: 22, color: "#fff", marginBottom: 10, fontWeight: "bold" },
  profileCard: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#1a001f",
    padding: 20,
    borderRadius: 10,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#333",
    alignSelf: "center",
    marginBottom: 16,
  },
  profileField: { marginBottom: 8 },
  fieldLabel: { color: "#ccc", fontSize: 13 },
  fieldValue: { color: "#fff", fontSize: 15 },
  button: {
    backgroundColor: "#4b006e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
