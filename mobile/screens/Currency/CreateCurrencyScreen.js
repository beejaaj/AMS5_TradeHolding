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

// import { currencyAPI } from "@/services/API";

export default function CreateCurrencyScreen() {
  const navigation = useNavigation();

  // Estados do Formulário
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [backing, setBacking] = useState('');
  const [status, setStatus] = useState(''); // 'ativo' ou 'fechado'

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    // Validação
    if (!symbol || !name || !description || !backing || !status) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currencyPayload = {
        symbol,
        name,
        description,
        backing,
        status
      };

      // --- CHAMADA DE API REAL (Descomente e ajuste) ---
      /*
      const res = await fetch(currencyAPI.registerCurrency(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currencyPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Falha no cadastro');
      }
      */

      // --- SIMULAÇÃO ---
      await new Promise(r => setTimeout(r, 1500));
      console.log("Moeda Criada:", currencyPayload);

      setSuccess('Cadastro realizado com sucesso!');
      
      // Retornar para a lista após sucesso
      setTimeout(() => {
        // navigation.navigate('CurrencyList'); // Ou goBack se veio da lista
        navigation.goBack();
      }, 1500);

    } catch (err) {
      setError(err.message || 'Erro ao cadastrar moeda.');
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
            <Text style={styles.title}>Nova Moeda</Text>
          </View>

          {/* Mensagens de Feedback */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          {/* Formulário */}
          <View style={styles.formContainer}>
            
            {/* Símbolo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Símbolo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: BTC"
                placeholderTextColor="#666"
                value={symbol}
                onChangeText={setSymbol}
                autoCapitalize="characters" // Símbolos geralmente são maiúsculos
              />
            </View>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da moeda"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Breve descrição da sua moeda"
                placeholderTextColor="#666"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            {/* Lastro */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lastro</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Dolar"
                placeholderTextColor="#666"
                value={backing}
                onChangeText={setBacking}
              />
            </View>

            {/* Status (Selector Customizado) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === 'ativo' && styles.statusSelected
                  ]}
                  onPress={() => setStatus('ativo')}
                >
                  <Feather name="check-circle" size={18} color={status === 'ativo' ? "#fff" : "#666"} />
                  <Text style={[styles.statusText, status === 'ativo' && { color: '#fff' }]}>Ativo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === 'fechado' && styles.statusSelected
                  ]}
                  onPress={() => setStatus('fechado')}
                >
                  <Feather name="x-circle" size={18} color={status === 'fechado' ? "#fff" : "#666"} />
                  <Text style={[styles.statusText, status === 'fechado' && { color: '#fff' }]}>Fechado</Text>
                </TouchableOpacity>
              </View>
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
                <Text style={styles.submitButtonText}>Cadastrar</Text>
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
    height: 100, // Altura maior para descrição
    textAlignVertical: 'top', // O texto começa no topo
  },

  // Status Selector Style
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

  // Botão
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