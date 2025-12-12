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
  Switch,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";

// Importe o serviço
import currencyService from "../../services/currencyService";

export default function CreateCurrencyScreen() {
  const navigation = useNavigation();

  // Estados do Formulário
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [backing, setBacking] = useState('Crypto'); // Valor padrão
  const [status, setStatus] = useState('Ativo');
  const [reverse, setReverse] = useState(false); 

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    // Validação
    if (!symbol || !name) {
      setError('Símbolo e Nome são obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const currencyPayload = {
        symbol: symbol.toUpperCase(),
        name,
        description,
        backing,
        status,
        reverse // Envia o booleano
      };

      await currencyService.registerCurrency(currencyPayload);

      setSuccess('Ativo criado com sucesso!');
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Erro ao criar ativo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header com Botão Voltar */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
        >
            <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Ativo</Text>
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
            
            {/* Ícone de Cabeçalho do Card */}
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="coins" size={24} color="#8B5CF6" />
                </View>
                <View>
                    <Text style={styles.cardTitle}>Dados da Moeda</Text>
                    <Text style={styles.cardSubtitle}>Preencha para listar no mercado.</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Mensagens */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <View style={styles.formContainer}>
              
              {/* Símbolo e Nome (Lado a Lado) */}
              <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Símbolo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: BTC"
                        placeholderTextColor="#474D57"
                        value={symbol}
                        onChangeText={setSymbol}
                        autoCapitalize="characters"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 2 }]}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Ativo"
                        placeholderTextColor="#474D57"
                        value={name}
                        onChangeText={setName}
                    />
                  </View>
              </View>

              {/* Descrição */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Breve descrição do projeto..."
                  placeholderTextColor="#474D57"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Lastro (Seleção Customizada) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Lastro</Text>
                <View style={styles.optionsGrid}>
                    {['Crypto', 'USDT', 'BRL', 'Gold'].map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.optionBtn, backing === opt && styles.optionBtnSelected]}
                            onPress={() => setBacking(opt)}
                        >
                            <Text style={[styles.optionText, backing === opt && styles.optionTextSelected]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
              </View>

              {/* Status */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status Inicial</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.statusBtn, status === 'Ativo' && styles.statusBtnActive]}
                    onPress={() => setStatus('Ativo')}
                  >
                    <Feather name="check-circle" size={16} color={status === 'Ativo' ? '#fff' : '#474D57'} />
                    <Text style={[styles.statusText, status === 'Ativo' && {color: '#fff'}]}>Ativo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, status === 'Inativo' && styles.statusBtnInactive]}
                    onPress={() => setStatus('Inativo')}
                  >
                    <Feather name="slash" size={16} color={status === 'Inativo' ? '#fff' : '#474D57'} />
                    <Text style={[styles.statusText, status === 'Inativo' && {color: '#fff'}]}>Inativo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Checkbox Reverso */}
              <View style={styles.switchContainer}>
                  <View style={{flex: 1}}>
                      <Text style={styles.switchTitle}>Inverter Cotação?</Text>
                      <Text style={styles.switchSubtitle}>Usar 1/Preço como base de cálculo</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#2B3139", true: "#8B5CF6" }}
                    thumbColor={"#EAECEF"}
                    onValueChange={setReverse}
                    value={reverse}
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
                    <Text style={styles.submitButtonText}>Salvar Ativo</Text>
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

  // Opções de Lastro (Grid)
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