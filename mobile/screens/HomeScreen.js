import React, { useState, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importe seu Header customizado
import { Header } from "../components/Header";

// Dados Mockados (Você pode substituir pela chamada do currencyService futuramente)
const CRYPTO_DATA = [
  { pair: 'BTC/USDT', price: '$63,200.12', change: '+2.15%', vol: '$1.5B', isUp: true },
  { pair: 'ETH/USDT', price: '$3,420.89', change: '-1.02%', vol: '$800M', isUp: false },
  { pair: 'XRP/USDT', price: '$0.5210', change: '+0.67%', vol: '$180M', isUp: true },
  { pair: 'ADA/USDT', price: '$0.4012', change: '-0.34%', vol: '$95M', isUp: false },
  { pair: 'DOGE/USDT', price: '$0.0831', change: '+4.88%', vol: '$300M', isUp: true },
];

export default function HomeScreen({ navigation }) {
  const [isLogged, setIsLogged] = useState(false);

  // useFocusEffect: Executa toda vez que a tela ganha foco (ex: voltando do Login)
  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          // Se tiver token, converte para true, senão false
          setIsLogged(!!token); 
        } catch (error) {
          console.log("Erro ao verificar login:", error);
        }
      };
      checkLogin();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userEmail');
      setIsLogged(false);
      Alert.alert("Sucesso", "Você saiu da conta.");
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* O Header já deve ter a lógica de navegação interna se precisar */}
      <Header /> 
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo Area */}
        <View style={styles.headerContainer}>
          <View style={styles.logo}>
             {/* Placeholder da Logo */}
             <Text style={{fontSize: 30}}>🌑</Text> 
          </View>
          <Text style={styles.title}>Bem-vindo à Lunaria</Text>
          <Text style={styles.subtitle}>
            Uma nova oportunidade de investimentos para a sua vida.
          </Text>
        </View>

        {/* LÓGICA DE BOTÕES: Login/Cadastro ou Dashboard */}
        {!isLogged ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => navigation.navigate("Login")} 
            >
              <Text style={styles.buttonTextPrimary}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buttonOutline]}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.buttonTextOutline}>Cadastro</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
             <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => navigation.navigate("AllUsers")} // Exemplo: Ir para lista de usuários
             >
              <Text style={styles.buttonTextPrimary}>Ver Usuários</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.buttonOutline]}
                onPress={() => navigation.navigate("CurrencyList")} // Exemplo: Ir para lista de moedas
             >
              <Text style={styles.buttonTextOutline}>Ver Moedas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabela de Mercado */}
        <View style={styles.marketContainer}>
          <Text style={styles.sectionTitle}>Mercado de Cripto (Lunaria)</Text>
          
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Par</Text>
            <Text style={[styles.headerText, { flex: 2, textAlign: 'right' }]}>Preço</Text>
            <Text style={[styles.headerText, { flex: 1.5, textAlign: 'right' }]}>24h %</Text>
          </View>

          {CRYPTO_DATA.map((coin, index) => (
            <View key={index} style={styles.coinRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.coinSymbol}>{coin.pair}</Text>
                <Text style={styles.coinVol}>Vol: {coin.vol}</Text>
              </View>
              
              <Text style={[styles.coinPrice, { flex: 2 }]}>{coin.price}</Text>
              
              <Text style={[
                styles.coinChange, 
                { flex: 1.5, color: coin.isUp ? "#4ade80" : "#f87171" }
              ]}>
                {coin.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Gráfico Placeholder */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.circleChart} />
            <Text style={styles.chartText}>Gráfico de Pizza aqui</Text>
          </View>
        </View>

        {/* Botão de Logout (Só aparece se logado) */}
        {isLogged && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20, // Ajustado pois já tem o Header em cima
    alignItems: "center",
  },
  
  // Header Area
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#5c1a75",
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a855f7'
  },
  title: { 
    fontSize: 28, 
    color: "#fff", 
    marginBottom: 10, 
    fontWeight: "bold",
    textAlign: "center"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#ccc", 
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22
  },

  // Buttons
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
    width: "100%",
    justifyContent: "center",
    flexWrap: 'wrap' // Permite quebrar linha se tela for pequena
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#5c1a75",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5c1a75",
  },
  buttonTextPrimary: { color: "#fff", fontWeight: "600", fontSize: 16 },
  buttonTextOutline: { color: "#d8b4fe", fontWeight: "600", fontSize: 16 },

  // Market Table
  marketContainer: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: "#1a001f",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerText: {
    color: "#d8b4fe",
    fontSize: 14,
    fontWeight: "bold",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  coinSymbol: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  coinVol: { color: "#888", fontSize: 12, marginTop: 2 },
  coinPrice: { color: "#fff", fontSize: 15, textAlign: 'right', fontWeight: "500" },
  coinChange: { textAlign: 'right', fontWeight: "bold", fontSize: 14 },

  // Chart
  chartContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  chartPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  circleChart: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 15,
    borderColor: "#5c1a75",
    borderTopColor: "#a855f7",
    borderRightColor: "#d8b4fe",
  },
  chartText: {
    position: "absolute",
    color: "#fff",
    fontSize: 12,
  },

  // Logout
  logoutButton: {
    padding: 15,
    width: "100%",
    alignItems: "center",
    backgroundColor: '#1a001f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333'
  },
  logoutText: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: 'bold'
  }
});