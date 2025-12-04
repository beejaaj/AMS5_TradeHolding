import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

import userService from "../services/userService";

export default function CreateAccountScreen() {
  const navigation = useNavigation();

  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Cria o objeto conforme a interface User definida no TypeScript
      const userPayload = { 
        name,
        email,
        phone,
        address,
        password,
        photo: photoUrl // Mapeando photoUrl do input para 'photo' da API
      };

      console.log("Enviando dados:", userPayload);

      // 2. CHAMADA REAL DA API VIA SERVICE
      await userService.create(userPayload);

      setSuccess('Cadastro realizado com sucesso!');
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigation.navigate('Login'); 
      }, 1500);

    } catch (err) {
      console.error("Erro no cadastro:", err);
      // Tenta pegar a mensagem de erro específica do backend
      const message = err.response?.data?.message || err.message || 'Erro ao cadastrar usuário.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Botão Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
               <Text style={{fontSize: 30}}>🌑</Text>
            </View>
            <Text style={styles.title}>Cadastro</Text>
          </View>

          {/* Mensagens */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          {/* Formulário */}
          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu endereço completo"
                placeholderTextColor="#666"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL da Foto (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={photoUrl}
                onChangeText={setPhotoUrl}
              />
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="********"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#aaa" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="********"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {/* Botão Submit */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            {/* Link para Login */}
            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Faça login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5c1a75",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#d8b4fe",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  // Mensagens
  errorText: {
    color: "#f87171",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
  },
  successText: {
    color: "#4ade80",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
  },

  // Form
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#e5e5e5",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1a001f",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5c1a75",
    fontSize: 16,
  },
  
  // Senha Wrapper
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
    padding: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 14,
  },

  // Botão
  submitButton: {
    backgroundColor: "#5c1a75",
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

  // Footer Link
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
  linkText: {
    color: "#d8b4fe",
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});