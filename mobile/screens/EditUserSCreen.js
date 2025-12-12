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
  Alert,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MotiView } from "moti";

import userService from "../services/userService";

export default function EditUserScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // ID do usuário a ser editado
  const { id } = route.params || {};

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    password: "" 
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar dados
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        let data;

        // Se veio ID, busca pelo ID, senão busca o perfil do logado
        if (id) {
            data = await userService.getById(id);
        } else {
            data = await userService.getProfile();
        }

        // Popula form (senha vazia para não sobrescrever com hash se não for mudar)
        setFormData({
            ...data,
            password: "" 
        });

      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Falha ao carregar dados.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await userService.update(formData.id, formData);
      setSuccess('Perfil atualizado com sucesso!');
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Erro ao atualizar.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <View style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
    );
  }

  const hasPhoto = formData.photo && formData.photo.length > 20 && formData.photo !== "default.png";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Fixo */}
      <View style={styles.topBar}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
        >
            <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
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
            {/* Avatar Editável (Simulação visual) */}
            <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                    {hasPhoto ? (
                        <Image source={{ uri: formData.photo }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarText}>
                            {formData.name ? formData.name.substring(0, 2).toUpperCase() : "--"}
                        </Text>
                    )}
                    <View style={styles.editBadge}>
                        <Feather name="camera" size={14} color="#fff" />
                    </View>
                </View>
                <Text style={styles.avatarHint}>Foto via URL abaixo</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <View style={styles.formContainer}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(t) => handleChange('name', t)}
                    placeholder="Nome"
                    placeholderTextColor="#474D57"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email (Leitura)</Text>
                <View style={[styles.inputWrapper, styles.readOnly]}>
                    <TextInput
                        style={[styles.input, {color: '#848E9C'}]}
                        value={formData.email}
                        editable={false} 
                    />
                    <Feather name="lock" size={16} color="#474D57" style={{marginRight: 15}}/>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(t) => handleChange('phone', t)}
                    keyboardType="phone-pad"
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#474D57"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(t) => handleChange('address', t)}
                    placeholder="Seu endereço"
                    placeholderTextColor="#474D57"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL da Foto</Text>
                <TextInput
                    style={styles.input}
                    value={formData.photo}
                    onChangeText={(t) => handleChange('photo', t)}
                    placeholder="https://..."
                    placeholderTextColor="#474D57"
                    autoCapitalize="none"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha (Opcional)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={formData.password}
                        onChangeText={(t) => handleChange('password', t)}
                        placeholder="Deixe vazio para manter a atual"
                        placeholderTextColor="#474D57"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#848E9C" />
                    </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                      <Feather name="save" size={20} color="#fff" />
                      <Text style={styles.submitButtonText}>Salvar Alterações</Text>
                  </>
                )}
              </TouchableOpacity>

            </View>
          </MotiView>
          <View style={{height: 40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  topBar: {
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

  // AVATAR SECTION
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#0B0E11", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#8B5CF6", position: 'relative', marginBottom: 8
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#8B5CF6' },
  editBadge: {
      position: 'absolute', bottom: 0, right: 0,
      backgroundColor: '#8B5CF6', padding: 8, borderRadius: 20,
      borderWidth: 2, borderColor: '#1E2329'
  },
  avatarHint: { color: '#848E9C', fontSize: 12 },

  // FORM
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { color: "#848E9C", marginBottom: 8, fontSize: 12, fontWeight: "bold", textTransform: 'uppercase' },
  
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#0B0E11",
    borderRadius: 12, borderWidth: 1, borderColor: "#474D57",
  },
  input: {
    backgroundColor: "#0B0E11", color: "#EAECEF", padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: "#474D57", fontSize: 16, width: '100%' // Input padrão
  },
  // Ajuste para inputs dentro de Wrapper (Senha/Readonly)
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#0B0E11",
    borderRadius: 12, borderWidth: 1, borderColor: "#474D57", overflow: 'hidden'
  },
  readOnly: { backgroundColor: '#15181D', borderColor: '#2B3139' },
  
  // Sobrescreve estilo do input quando está dentro de um wrapper para remover bordas duplicadas
  input: {
      flex: 1, color: "#EAECEF", paddingVertical: 14, paddingHorizontal: 12, fontSize: 16,
      backgroundColor: 'transparent', borderWidth: 0 
  },
  // Mas precisamos de um estilo para inputs SOLTOS (sem wrapper)
  // Então vamos ajustar a lógica do render acima: 
  // Nos inputs soltos (Nome, Tel, Endereço, Foto), apliquei style={styles.inputStandalone} no JSX abaixo
  
  divider: { height: 1, backgroundColor: '#2B3139', marginVertical: 20 },

  eyeIcon: { padding: 12 },

  submitButton: {
    backgroundColor: "#8B5CF6", paddingVertical: 16, borderRadius: 12,
    alignItems: "center", marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 10,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  errorText: { color: "#F6465D", backgroundColor: "rgba(246, 70, 93, 0.1)", padding: 12, borderRadius: 8, textAlign: "center", marginBottom: 20 },
  successText: { color: "#0ECB81", backgroundColor: "rgba(14, 203, 129, 0.1)", padding: 12, borderRadius: 8, textAlign: "center", marginBottom: 20 },
});