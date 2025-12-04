import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { Header } from "../components/Header";
// Se for usar verificação real de token no futuro:
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Dados vindos do seu código Web
const CRYPTO_DATA = [
  { pair: 'BTC/USDT', price: '$63,200.12', change: '+2.15%', vol: '$1.5B', isUp: true },
  { pair: 'ETH/USDT', price: '$3,420.89', change: '-1.02%', vol: '$800M', isUp: false },
  { pair: 'XRP/USDT', price: '$0.5210', change: '+0.67%', vol: '$180M', isUp: true },
  { pair: 'ADA/USDT', price: '$0.4012', change: '-0.34%', vol: '$95M', isUp: false },
  { pair: 'DOGE/USDT', price: '$0.0831', change: '+4.88%', vol: '$300M', isUp: true },
];

export default function HomeScreen({ navigation }) {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Simulação da verificação do token (como no seu localStorage)
    const checkLogin = async () => {
      // Exemplo real seria: const token = await AsyncStorage.getItem('token');
      const token = null; // Mude para "sim" para testar o estado logado
      setIsLogged(!!token);
    };
    checkLogin();
  }, []);

  return (
    
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo Area */}
        <View style={styles.headerContainer}>
          <View style={styles.logo}>
             {/* Você pode colocar um <Image /> aqui */}
             <Text style={{fontSize: 30}}>🌑</Text> 
          </View>
          <Text style={styles.title}>Bem-vindo à Lunaria</Text>
          <Text style={styles.subtitle}>
            Uma nova oportunidade de investimentos para a sua vida.
          </Text>
        </View>

        {/* Botões de Ação (Condicional igual ao Web) */}
        {!isLogged ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => navigation.navigate("Login")} // Certifique-se que essa rota existe
            >
              <Text style={styles.buttonTextPrimary}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buttonOutline]}
              onPress={() => navigation.navigate("CreateAccount")} // Certifique-se que essa rota existe
            >
              <Text style={styles.buttonTextOutline}>Cadastro</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
             <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonTextPrimary}>Ir para Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabela de Mercado (Adaptada para Mobile) */}
        <View style={styles.marketContainer}>
          <Text style={styles.sectionTitle}>Mercado de Cripto (Lunaria)</Text>
          
          {/* Cabeçalho da Lista */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Par</Text>
            <Text style={[styles.headerText, { flex: 2, textAlign: 'right' }]}>Preço</Text>
            <Text style={[styles.headerText, { flex: 1.5, textAlign: 'right' }]}>24h %</Text>
          </View>

          {/* Lista de Moedas */}
          {CRYPTO_DATA.map((coin, index) => (
            <View key={index} style={styles.coinRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.coinSymbol}>{coin.pair}</Text>
                <Text style={styles.coinVol}>Vol: {coin.vol}</Text>
              </View>
              
              <Text style={[styles.coinPrice, { flex: 2 }]}>{coin.price}</Text>
              
              <Text style={[
                styles.coinChange, 
                { flex: 1.5, color: coin.isUp ? "#4ade80" : "#f87171" } // Green-400 : Red-400
              ]}>
                {coin.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Placeholder do Gráfico (CryptoPieChart) */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.circleChart} />
            <Text style={styles.chartText}>Gráfico de Pizza aqui</Text>
          </View>
        </View>

        {isLogged && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setIsLogged(false)}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // bg-main
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#5c1a75", // Roxo escuro
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a855f7' // Highlight roxo mais claro
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
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#5c1a75", // bg-panel
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5c1a75",
  },
  buttonTextPrimary: { color: "#fff", fontWeight: "600", fontSize: 16 },
  buttonTextOutline: { color: "#d8b4fe", fontWeight: "600", fontSize: 16 },

  // Market Table List
  marketContainer: {
    width: "100%",
    marginBottom: 30,
    backgroundColor: "#1a001f", // bg de fundo levemente roxo
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // text-title
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
    color: "#d8b4fe", // roxo claro para titulos
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
    borderTopColor: "#a855f7", // Simular fatias
    borderRightColor: "#d8b4fe",
  },
  chartText: {
    position: "absolute",
    color: "#fff",
    fontSize: 12,
  },

  // Logout
  logoutButton: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#f87171",
    fontSize: 16,
  }
});