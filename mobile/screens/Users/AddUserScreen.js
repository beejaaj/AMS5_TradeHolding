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

import userService from "../../services/userService";

export default function AddUserScreen() {
  const navigation = useNavigation();

  // Campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Nome, Email e Senha são obrigatórios.");
      return;
    }

    setLoading(true);
    
    try {
      const userPayload = { name, email, phone, address, password, photo: photoUrl };
      
      // Usa a mesma função de criar (backend trata igual)
      await userService.create(userPayload);

      Alert.alert("Sucesso", "Usuário adicionado com sucesso!");
      
      // Volta para a lista de usuários e recarrega
      navigation.goBack(); 

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Falha ao criar usuário.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header com Voltar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
        >
            <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Usuário</Text>
        <View style={{width: 40}} /> 
      </View>

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
              <View style={styles.iconContainer}>
                 <Feather name="user-plus" size={24} color="#8B5CF6" />
              </View>
              <View>
                 <Text style={styles.cardTitle}>Adicionar Membro</Text>
                 <Text style={styles.cardSubtitle}>Preencha os dados do novo usuário.</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome do usuário"
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
                  placeholder="email@exemplo.com"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço</Text>
              <View style={styles.inputWrapper}>
                <Feather name="map-pin" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Endereço completo"
                  placeholderTextColor="#666"
                  value={address}
                  onChangeText={setAddress}
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
              <Text style={styles.label}>Senha Inicial</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#848E9C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Defina uma senha"
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

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleCreateUser}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                    <Feather name="save" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Cadastrar Usuário</Text>
                </>
              )}
            </TouchableOpacity>

          </MotiView>
          <View style={{height: 40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  
  headerBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#EAECEF' },
  backButton: { padding: 8, backgroundColor: '#1E2329', borderRadius: 12, borderWidth: 1, borderColor: '#2B3139' },

  scrollContent: { padding: 20 },

  formCard: {
    backgroundColor: "#1E2329", borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: "#2B3139",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  
  headerContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  iconContainer: {
      width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)',
      alignItems: 'center', justifyContent: 'center'
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#EAECEF' },
  cardSubtitle: { fontSize: 12, color: '#848E9C' },
  divider: { height: 1, backgroundColor: '#2B3139', marginBottom: 20 },

  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 16 },
  label: { color: "#848E9C", marginBottom: 6, fontSize: 12, fontWeight: "bold", textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#0B0E11",
    borderRadius: 12, borderWidth: 1, borderColor: "#474D57",
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, color: "#EAECEF", paddingVertical: 14, paddingHorizontal: 12, fontSize: 16 },
  eyeIcon: { padding: 12 },

  submitButton: {
    backgroundColor: "#8B5CF6", paddingVertical: 16, borderRadius: 12,
    alignItems: "center", marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 10,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});