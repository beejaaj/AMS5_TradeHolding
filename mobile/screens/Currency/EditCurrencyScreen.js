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
import { useNavigation, useRoute } from "@react-navigation/native";

// import { currencyAPI } from "@/services/API";

export default function EditCurrencyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Pegando o ID passado pela navegação
  const { id } = route.params || {}; 

  // Estado dos dados da moeda
  const [currency, setCurrency] = useState({
    symbol: "",
    name: "",
    description: "",
    backing: "",
    status: "",
  });

  // Estados de UI
  const [fetching, setFetching] = useState(true); // Carregando dados iniciais
  const [loading, setLoading] = useState(false);  // Salvando dados
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Carregar dados da moeda ao abrir a tela
  useEffect(() => {
    async function fetchCurrency() {
      if (!id) return;
      
      setFetching(true);
      try {
        // --- API REAL ---
        /*
        const res = await fetch(currencyAPI.getCurrencyDetails(id));
        if (!res.ok) throw new Error("Erro ao buscar moeda");
        const data = await res.json();
        setCurrency({
            symbol: data.symbol,
            name: data.name,
            description: data.description,
            backing: data.backing,
            status: data.status.toLowerCase(),
        });
        */

        // --- SIMULAÇÃO ---
        await new Promise(r => setTimeout(r, 1000));
        // Simulando dados que viriam do backend baseados no ID
        setCurrency({
          symbol: "BTC",
          name: "Bitcoin",
          description: "A primeira criptomoeda descentralizada.",
          backing: "Energia",
          status: "ativo",
        });

      } catch (err) {
        setError(err.message || "Erro ao carregar moeda");
        Alert.alert("Erro", "Não foi possível carregar os dados da moeda.");
        navigation.goBack();
      } finally {
        setFetching(false);
      }
    }

    fetchCurrency();
  }, [id]);

  // Função auxiliar para atualizar o estado
  const updateField = (field, value) => {
    setCurrency(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- API REAL ---
      /*
      const res = await fetch(currencyAPI.updateCurrency(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currency),
      });
      if (!res.ok) throw new Error("Erro ao atualizar moeda!");
      */

      // --- SIMULAÇÃO ---
      await new Promise(r => setTimeout(r, 1500));
      console.log("Dados Atualizados:", currency);

      setSuccess("Moeda atualizada com sucesso!");
      
      // Feedback visual antes de manter na tela ou sair
      setTimeout(() => {
         setSuccess(""); // Limpa mensagem
         // Opcional: navigation.goBack(); 
      }, 2000);

    } catch (err) {
      setError(err.message || "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  // Renderização de Loading Inicial (Tela inteira)
  if (fetching) {
    return (
      <View style={[styles.container, styles.centerLoading]}>
        <ActivityIndicator size="large" color="#5c1a75" />
        <Text style={{color: '#fff', marginTop: 10}}>Carregando dados...</Text>
      </View>
    );
  }

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
            <Text style={styles.title}>Editar Moeda</Text>
          </View>

          {/* Mensagens */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          {/* Formulário */}
          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Símbolo</Text>
              <TextInput
                style={styles.input}
                placeholder="Símbolo"
                placeholderTextColor="#666"
                value={currency.symbol}
                onChangeText={(t) => updateField('symbol', t)}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#666"
                value={currency.name}
                onChangeText={(t) => updateField('name', t)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição"
                placeholderTextColor="#666"
                value={currency.description}
                onChangeText={(t) => updateField('description', t)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lastro</Text>
              <TextInput
                style={styles.input}
                placeholder="Lastro"
                placeholderTextColor="#666"
                value={currency.backing}
                onChangeText={(t) => updateField('backing', t)}
              />
            </View>

            {/* Status Custom Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    currency.status === 'ativo' && styles.statusSelected
                  ]}
                  onPress={() => updateField('status', 'ativo')}
                >
                  <Feather name="check-circle" size={18} color={currency.status === 'ativo' ? "#fff" : "#666"} />
                  <Text style={[styles.statusText, currency.status === 'ativo' && { color: '#fff' }]}>Ativo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    currency.status === 'fechado' && styles.statusSelected
                  ]}
                  onPress={() => updateField('status', 'fechado')}
                >
                  <Feather name="x-circle" size={18} color={currency.status === 'fechado' ? "#fff" : "#666"} />
                  <Text style={[styles.statusText, currency.status === 'fechado' && { color: '#fff' }]}>Fechado</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar Alterações</Text>
              )}
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
    backgroundColor: "#000",
  },
  centerLoading: {
    justifyContent: 'center',
    alignItems: 'center',
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

  // Feedback
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Status Style
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
  },
  statusSelected: {
    backgroundColor: "#5c1a75",
    borderColor: "#d8b4fe",
  },
  statusText: {
    color: "#666",
    fontWeight: "600",
  },

  // Button
  submitButton: {
    backgroundColor: "#5c1a75",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});