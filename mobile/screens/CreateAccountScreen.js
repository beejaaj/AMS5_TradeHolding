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
import { MotiView } from "moti";

import userService from "../services/userService";

export default function CreateAccountScreen() {
  const navigation = useNavigation();

  // Campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    
    try {
      const userPayload = { name, email, phone, address, password, photo: photoUrl };
      await userService.create(userPayload);

      Alert.alert("Sucesso", "Conta criada! Faça login.");
      navigation.navigate('Login'); 

    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
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
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.formCard}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Nova Conta</Text>
              <Text style={styles.subtitle}>Preencha seus dados abaixo</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color="#848E9C" style={styles.inputIcon} />
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
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="phone" size={18} color="#848E9C" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL da Foto (Opcional)</Text>
              <View style={styles.inputWrapper}>
                <Feather name="image" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                  value={photoUrl}
                  onChangeText={setPhotoUrl}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#848E9C" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputWrapper}>
                <Feather name="check-circle" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

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

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Faça login</Text>
              </TouchableOpacity>
            </View>

          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  scrollContent: { padding: 20, paddingTop: 80, paddingBottom: 40 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },

  formCard: {
    backgroundColor: "#1E2329", borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: "#2B3139",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  headerContainer: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#EAECEF", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#848E9C" },

  inputGroup: { marginBottom: 16 },
  label: { color: "#EAECEF", marginBottom: 6, fontSize: 13, fontWeight: "600", textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#0B0E11",
    borderRadius: 12, borderWidth: 1, borderColor: "#474D57",
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, color: "#EAECEF", paddingVertical: 14, paddingHorizontal: 12, fontSize: 16 },
  eyeIcon: { padding: 12 },

  submitButton: {
    backgroundColor: "#8B5CF6", paddingVertical: 16, borderRadius: 12,
    alignItems: "center", marginTop: 20, marginBottom: 24,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  footerLink: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderTopColor: "#2B3139", paddingTop: 20 },
  footerText: { color: "#848E9C", fontSize: 14 },
  linkText: { color: "#8B5CF6", fontWeight: "bold", fontSize: 14 },
});