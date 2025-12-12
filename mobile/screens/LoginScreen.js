import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';

import userService from "../services/userService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-Login
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) navigation.replace("Home"); 
      } catch (e) {}
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      await userService.login({ email, password });
      
      // Sucesso
      setTimeout(() => {
        navigation.replace("Home"); 
      }, 500);

    } catch (err) {
      console.error("Erro no Login:", err);
      Alert.alert("Erro", "Credenciais inválidas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate("Home")}
      >
        <Feather name="arrow-left" size={24} color="#848E9C" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView 
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700 }}
            style={styles.loginCard}
          >
            
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                 <Text style={{fontSize: 40}}>🌑</Text>
              </View>
              <Text style={styles.appTitle}>Entrar na Conta</Text>
              <Text style={styles.headerText}>Bem-vindo de volta à Lunaria</Text>
            </View>

            <View style={styles.formContainer}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="mail" size={18} color="#848E9C" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="exemplo@email.com"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="lock" size={18} color="#848E9C" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#848E9C" />
                    </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerLink}>
                <Text style={styles.registerTextNormal}>Ainda não tem conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
                    <Text style={styles.registerTextHighlight}>Registre-se grátis</Text>
                </TouchableOpacity>
              </View>

            </View>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },

  loginCard: {
    backgroundColor: "#1E2329", borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: "#2B3139",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  headerContainer: { alignItems: "center", marginBottom: 30 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#15181D",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
    borderWidth: 2, borderColor: "#2B3139",
  },
  appTitle: { fontSize: 24, fontWeight: "bold", color: "#EAECEF", marginBottom: 4 },
  headerText: { color: "#848E9C", fontSize: 14 },

  formContainer: { width: "100%" },
  inputGroup: { marginBottom: 20 },
  label: { color: "#EAECEF", marginBottom: 8, fontSize: 14, fontWeight: "600" },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#0B0E11",
    borderRadius: 12, borderWidth: 1, borderColor: "#474D57",
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, color: "#EAECEF", paddingVertical: 14, paddingHorizontal: 12, fontSize: 16 },
  eyeIcon: { padding: 12 },

  submitButton: {
    backgroundColor: "#8B5CF6", paddingVertical: 16, borderRadius: 12,
    alignItems: "center", marginTop: 10, marginBottom: 24,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  registerLink: {
    flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1,
    borderTopColor: "#2B3139", paddingTop: 20,
  },
  registerTextNormal: { color: "#848E9C", fontSize: 14 },
  registerTextHighlight: { color: "#8B5CF6", fontWeight: "bold", fontSize: 14 },
});