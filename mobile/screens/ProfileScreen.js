import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Header } from "../components/Header";

import userService from "../services/userService";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar seu perfil.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#5c1a75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {user && (
          <View style={styles.profileCard}>
            
            <View style={styles.imageContainer}>
                {user.photo ? (
                    <Image 
                        source={{ uri: user.photo }} 
                        style={styles.profileImage} 
                    />
                ) : (
                    <View style={[styles.profileImage, styles.placeholderImage]}>
                        <Text style={{fontSize: 40}}>👤</Text>
                    </View>
                )}
            </View>

            <Text style={styles.title}>{user.name}</Text>

            <View style={styles.divider} />

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{user.email}</Text>
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Telefone:</Text>
              <Text style={styles.fieldValue}>{user.phone || "Não informado"}</Text>
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Endereço:</Text>
              <Text style={styles.fieldValue}>{user.address || "Não informado"}</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Mudar sua senha</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40, // Espaço após o Header
    alignItems: "center",
  },
  
  // Botão Voltar
  backButton: {
    alignSelf: "flex-start",
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },

  // Card
  profileCard: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#1a001f",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  // Imagem
  imageContainer: {
    marginBottom: 16,
    shadowColor: "#5c1a75",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#5c1a75",
  },
  placeholderImage: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  // Textos
  title: { 
    fontSize: 24, 
    color: "#fff", 
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center"
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#333",
    marginVertical: 15,
  },
  profileField: { 
    width: "100%",
    marginBottom: 16,
  },
  fieldLabel: { 
    color: "#d8b4fe", // Roxo claro
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600"
  },
  fieldValue: { 
    color: "#fff", 
    fontSize: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },

  // Botão Ação
  button: {
    width: "100%",
    backgroundColor: "#5c1a75",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16
  },
});