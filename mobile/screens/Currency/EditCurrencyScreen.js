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
  Switch
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MotiView } from "moti";

// Importe o serviço
import currencyService from "../../services/currencyService";

export default function EditCurrencyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // ID recebido da navegação
  const { id } = route.params || {}; 

  // Estados do Formulário
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    description: "",
    backing: "Crypto",
    status: "Ativo",
    reverse: false
  });

  const [fetching, setFetching] = useState(true); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 1. CARREGAR DADOS
  useEffect(() => {
    async function fetchCurrency() {
      if (!id) {
          setError("ID da moeda não encontrado.");
          setFetching(false);
          return;
      }
      
      setFetching(true);
      try {
        const data = await currencyService.getCurrencyDetails(id);
        
        // Popula o formulário com os dados vindos do backend
        setFormData({
            symbol: data.symbol,
            name: data.name,
            description: data.description || "",
            backing: data.backing || "Crypto",
            status: data.status || "Ativo",
            reverse: data.reverse || false
        });

      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados.");
        Alert.alert("Erro", "Não foi possível carregar os dados.");
        navigation.goBack();
      } finally {
        setFetching(false);
      }
    }

    fetchCurrency();
  }, [id]);

  // Helper para atualizar campos de texto
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SALVAR ALTERAÇÕES
  const handleSubmit = async () => {
    // Validação básica
    if (!formData.symbol || !formData.name) {
        setError("Símbolo e Nome são obrigatórios.");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await currencyService.updateCurrency(id, formData);

      setSuccess("Moeda atualizada com sucesso!");
      
      setTimeout(() => {
         setSuccess(""); 
         navigation.goBack(); 
      }, 1500);

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Erro ao atualizar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, styles.centerLoading]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{color: '#848E9C', marginTop: 10}}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.headerBar}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
        >
            <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Ativo</Text>
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
            
            {/* Header do Card */}
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="edit" size={24} color="#8B5CF6" />
                </View>
                <View>
                    <Text style={styles.cardTitle}>{formData.symbol}</Text>
                    <Text style={styles.cardSubtitle}>Editando informações.</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <View style={styles.formContainer}>
              
              {/* Símbolo e Nome */}
              <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Símbolo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: BTC"
                        placeholderTextColor="#474D57"
                        value={formData.symbol}
                        onChangeText={(t) => handleChange('symbol', t)}
                        autoCapitalize="characters"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 2 }]}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Ativo"
                        placeholderTextColor="#474D57"
                        value={formData.name}
                        onChangeText={(t) => handleChange('name', t)}
                    />
                  </View>
              </View>

              {/* Descrição */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descrição..."
                  placeholderTextColor="#474D57"
                  value={formData.description}
                  onChangeText={(t) => handleChange('description', t)}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Lastro */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Lastro</Text>
                <View style={styles.optionsGrid}>
                    {['Crypto', 'USDT', 'BRL', 'Gold'].map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.optionBtn, formData.backing === opt && styles.optionBtnSelected]}
                            onPress={() => handleChange('backing', opt)}
                        >
                            <Text style={[styles.optionText, formData.backing === opt && styles.optionTextSelected]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
              </View>

              {/* Status */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.statusBtn, formData.status === 'Ativo' && styles.statusBtnActive]}
                    onPress={() => handleChange('status', 'Ativo')}
                  >
                    <Feather name="check-circle" size={16} color={formData.status === 'Ativo' ? '#fff' : '#474D57'} />
                    <Text style={[styles.statusText, formData.status === 'Ativo' && {color: '#fff'}]}>Ativo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, formData.status === 'Inativo' && styles.statusBtnInactive]}
                    onPress={() => handleChange('status', 'Inativo')}
                  >
                    <Feather name="slash" size={16} color={formData.status === 'Inativo' ? '#fff' : '#474D57'} />
                    <Text style={[styles.statusText, formData.status === 'Inativo' && {color: '#fff'}]}>Inativo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Checkbox Reverso */}
              <View style={styles.switchContainer}>
                  <View style={{flex: 1}}>
                      <Text style={styles.switchTitle}>Inverter Cotação?</Text>
                      <Text style={styles.switchSubtitle}>Usar 1/Preço como base.</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#2B3139", true: "#8B5CF6" }}
                    thumbColor={"#EAECEF"}
                    onValueChange={(val) => handleChange('reverse', val)}
                    value={formData.reverse}
                  />
              </View>

              {/* Botão Submit */}
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
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
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header da Tela
  headerBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#EAECEF' },
  backButton: { padding: 8, backgroundColor: '#1E2329', borderRadius: 12, borderWidth: 1, borderColor: '#2B3139' },

  scrollContent: { padding: 20 },

  // Card Principal
  formCard: {
    backgroundColor: "#1E2329", borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: "#2B3139", shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  
  // Header do Card
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  iconContainer: {
      width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)',
      alignItems: 'center', justifyContent: 'center'
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#EAECEF' },
  cardSubtitle: { fontSize: 12, color: '#848E9C' },
  divider: { height: 1, backgroundColor: '#2B3139', marginBottom: 20 },

  // Inputs
  formContainer: { gap: 16 },
  inputGroup: { marginBottom: 4 },
  row: { flexDirection: 'row', gap: 10 },
  label: { color: "#848E9C", marginBottom: 8, fontSize: 12, fontWeight: "bold", textTransform: 'uppercase' },
  input: {
    backgroundColor: "#0B0E11", color: "#EAECEF", padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: "#2B3139", fontSize: 14,
  },
  textArea: { height: 80 },

  // Opções de Lastro
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: {
      flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: 12,
      borderRadius: 10, borderWidth: 1, borderColor: '#2B3139', backgroundColor: '#0B0E11'
  },
  optionBtnSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  optionText: { color: '#848E9C', fontWeight: '600' },
  optionTextSelected: { color: '#fff' },

  // Botões de Status
  statusBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2B3139', backgroundColor: '#0B0E11'
  },
  statusBtnActive: { borderColor: '#0ECB81', backgroundColor: 'rgba(14, 203, 129, 0.1)' },
  statusBtnInactive: { borderColor: '#F6465D', backgroundColor: 'rgba(246, 70, 93, 0.1)' },
  statusText: { color: '#848E9C', fontWeight: 'bold' },

  // Switch Reverso
  switchContainer: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: '#0B0E11', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#2B3139', marginTop: 5
  },
  switchTitle: { color: '#EAECEF', fontWeight: 'bold', fontSize: 14 },
  switchSubtitle: { color: '#848E9C', fontSize: 12 },

  // Botão Salvar
  submitButton: {
    backgroundColor: "#8B5CF6", paddingVertical: 16, borderRadius: 12,
    alignItems: "center", flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Feedback
  errorText: { color: "#F6465D", backgroundColor: "rgba(246, 70, 93, 0.1)", padding: 10, borderRadius: 8, textAlign: "center", marginBottom: 15 },
  successText: { color: "#0ECB81", backgroundColor: "rgba(14, 203, 129, 0.1)", padding: 10, borderRadius: 8, textAlign: "center", marginBottom: 15 },
});