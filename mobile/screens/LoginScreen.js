import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from "../services/API";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          navigation.replace("Home"); 
        }
      } catch (e) {
        console.log("Erro ao verificar token inicial", e);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Tentando login em:", authAPI.login());

      const response = await fetch(authAPI.login(), {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json" 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => {
          throw new Error("Erro de comunicação com o servidor (Resposta inválida).");
      });

      if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas ou erro no servidor.");
      }

      if (!data.token) {
          throw new Error("Token não recebido. Contate o suporte.");
      }

      console.log("Login OK! Token recebido:", data.token);

      await AsyncStorage.setItem("token", data.token);
      
      await AsyncStorage.setItem("userEmail", email);

      setSuccess("Login realizado com sucesso!");
      
      setTimeout(() => {
        navigation.replace("Home"); 
      }, 500);

    } catch (err) {
      console.error("Erro no Login:", err);
      setError(err.message || "Erro ao efetuar login. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack("Home")}
      >
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={{fontSize: 40}}>🌑</Text>
            </View>
            <Text style={styles.appTitle}>Lunaria</Text>
            <Text style={styles.headerText}>
              Este é o app oficial. Não compartilhe sua senha.
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (ou nome de usuário)</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#aaa" 
                  />
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

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.registerText}>
                Cadastre-se, caso não tenha uma conta
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // bg-main
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 100, // Espaço para não ficar colado no topo
  },
  
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5c1a75",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#d8b4fe",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerText: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 14,
    maxWidth: "80%",
  },

  // Mensagens
  errorText: {
    color: "#f87171", // vermelho claro
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
    overflow: 'hidden', // necessário para borderRadius no Text em alguns casos
  },
  successText: {
    color: "#4ade80", // verde claro
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
    overflow: 'hidden',
  },

  // Formulário
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1a001f", // Roxo bem escuro
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5c1a75", // Roxo borda
    fontSize: 16,
  },
  
  // Senha com ícone
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a001f",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5c1a75",
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },

  // Botão Submit
  submitButton: {
    backgroundColor: "#5c1a75", // bg-panel
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Link Cadastro
  registerLink: {
    alignItems: "center",
    padding: 10,
  },
  registerText: {
    color: "#d8b4fe", // Roxo claro
    textDecorationLine: "underline",
    fontSize: 14,
  },
});