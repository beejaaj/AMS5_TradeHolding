import React, { useState, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome5 } from "@expo/vector-icons";

// Bibliotecas Visuais
import { MotiView } from "moti"; 
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

import { Header } from "../components/Header";
import currencyService from "../services/currencyService";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currencies, setCurrencies] = useState([]);
  const [highlightCoin, setHighlightCoin] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dados Mockados para o Gráfico da Home (Visual apenas)
  const chartData = {
    labels: ["D", "S", "T", "Q", "Q", "S", "S"],
    datasets: [
      {
        data: [62000, 63500, 61800, 64200, 63000, 65500, 63200], 
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Roxo #8B5CF6
        strokeWidth: 3
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2329",
    backgroundGradientTo: "#1E2329",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(132, 142, 156, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "0" },
    propsForBackgroundLines: { strokeDasharray: "" }
  };

  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        setIsLogged(!!token); 
      };
      checkLogin();
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await currencyService.getAllCurrency();
      setCurrencies(data);
      // Pega Bitcoin ou o primeiro da lista
      const featured = data.find(c => c.symbol === "BTC") || data[0];
      setHighlightCoin(featured);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <Header /> 
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6"/>
        }
      >
        
        {/* === HERO SECTION === */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.heroSection}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Plataforma Live</Text>
          </View>

          <Text style={styles.heroTitle}>
            O futuro do trade é{"\n"}
            <Text style={styles.heroTitleHighlight}>Lunaria</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Explore o mercado de criptoativos com dados em tempo real e segurança avançada.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => navigation.navigate(isLogged ? "CurrencyList" : "Login")}
            >
              <Text style={styles.buttonTextPrimary}>{isLogged ? "Ver Mercado" : "Entrar Agora"}</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
            
            {!isLogged && (
                <TouchableOpacity 
                  style={[styles.button, styles.buttonOutline]}
                  onPress={() => navigation.navigate("CreateAccount")}
                >
                  <Text style={styles.buttonTextOutline}>Criar Conta</Text>
                </TouchableOpacity>
            )}
          </View>
        </MotiView>

        {/* === CARD DESTAQUE === */}
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 300 }}
          style={styles.highlightCard}
        >
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.15)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {loading ? (
             <ActivityIndicator color="#8B5CF6" style={{padding: 40}}/>
          ) : (
            <>
              <View style={styles.highlightHeader}>
                <View>
                  <Text style={styles.label}>ATIVO EM DESTAQUE</Text>
                  <View style={styles.coinTitleRow}>
                    <Text style={styles.coinName}>
                      {highlightCoin ? highlightCoin.name : "Carregando..."}
                    </Text>
                    <View style={styles.symbolBadge}>
                      <Text style={styles.symbolText}>
                        {highlightCoin ? highlightCoin.symbol : "..."}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.priceText}>R$ 63,200</Text>
                  <View style={styles.variationRow}>
                    <Feather name="trending-up" size={14} color="#0ECB81" />
                    <Text style={[styles.variationText, { color: "#0ECB81" }]}>+2.15%</Text>
                  </View>
                </View>
              </View>

              <LineChart
                data={chartData}
                width={width - 80}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  paddingRight: 40
                }}
                withInnerLines={false}
                withOuterLines={false}
                yAxisLabel="R$"
              />
            </>
          )}
        </MotiView>

        {/* === ESTATÍSTICAS === */}
        <View style={styles.statsContainer}>
          {[
            { icon: "coins", label: "ATIVOS", value: currencies.length || "-", color: "#8B5CF6" },
            { icon: "globe", label: "GLOBAL", value: "24/7", color: "#0ECB81" },
            { icon: "shield-alt", label: "SEGURANÇA", value: "100%", color: "#FCD535" }
          ].map((stat, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 500 + (index * 150), type: 'timing' }}
              style={styles.statCard}
            >
              <View style={[styles.iconBox]}>
                <FontAwesome5 name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </MotiView>
          ))}
        </View>

        {/* === LISTA RÁPIDA === */}
        <MotiView 
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 800 }}
          style={styles.listSection}
        >
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Mercado Agora</Text>
            <TouchableOpacity onPress={() => navigation.navigate("CurrencyList")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.colText, { flex: 2 }]}>Ativo</Text>
            <Text style={[styles.colText, { flex: 1 }]}>Símbolo</Text>
            <Text style={[styles.colText, { flex: 1, textAlign: 'right' }]}>Ação</Text>
          </View>

          {currencies.slice(0, 5).map((c, i) => (
            <TouchableOpacity 
              key={c.id || i} 
              style={styles.tableRow}
              onPress={() => navigation.navigate("CurrencyDetails", { currency: c })}
            >
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinIconText}>{c.symbol ? c.symbol.substring(0, 2) : "$"}</Text>
                </View>
                <Text style={styles.rowTextWhite} numberOfLines={1}>{c.name}</Text>
              </View>
              <Text style={[styles.rowTextGray, { flex: 1 }]}>{c.symbol}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.actionText}>Trade</Text>
              </View>
            </TouchableOpacity>
          ))}
        </MotiView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  scrollContent: { paddingBottom: 20 },

  // HERO
  heroSection: { padding: 24, paddingTop: 30 },
  badgeContainer: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 20,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6', marginRight: 8 },
  badgeText: { color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', lineHeight: 40, marginBottom: 16 },
  heroTitleHighlight: { color: '#8B5CF6' },
  heroSubtitle: { fontSize: 16, color: '#848E9C', lineHeight: 24, marginBottom: 30 },
  heroButtons: { flexDirection: 'row', gap: 12 },
  button: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 130,
  },
  buttonPrimary: { backgroundColor: '#8B5CF6' },
  buttonOutline: { backgroundColor: '#2B3139', borderWidth: 1, borderColor: '#474D57' },
  buttonTextPrimary: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  buttonTextOutline: { color: '#EAECEF', fontWeight: 'bold', fontSize: 15 },

  // CARD DESTAQUE
  highlightCard: {
    marginHorizontal: 24, backgroundColor: '#1E2329', borderRadius: 24,
    borderWidth: 1, borderColor: '#2B3139', padding: 20, marginBottom: 30,
    overflow: 'hidden', position: 'relative'
  },
  highlightHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#848E9C', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  coinTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coinName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  symbolBadge: { backgroundColor: '#2B3139', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  symbolText: { color: '#848E9C', fontSize: 12 },
  priceText: { color: '#EAECEF', fontSize: 18, fontWeight: 'bold' },
  variationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  variationText: { fontSize: 12, fontWeight: 'bold' },

  // STATS
  statsContainer: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 30 },
  statCard: {
    flex: 1, backgroundColor: '#1E2329', padding: 12, borderRadius: 16,
    borderWidth: 1, borderColor: '#2B3139', alignItems: 'flex-start'
  },
  iconBox: {
    width: 36, height: 36, backgroundColor: '#0B0E11', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  statLabel: { color: '#848E9C', fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  statValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // LISTA
  listSection: {
    marginHorizontal: 24, backgroundColor: '#1E2329', borderRadius: 16,
    borderWidth: 1, borderColor: '#2B3139', padding: 16,
  },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2B3139',
  },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  seeAllText: { color: '#8B5CF6', fontSize: 14, fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 4 },
  colText: { color: '#848E9C', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  tableRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#2B3139',
  },
  coinIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#2B3139',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#474D57',
  },
  coinIconText: { color: '#8B5CF6', fontSize: 10, fontWeight: 'bold' },
  rowTextWhite: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  rowTextGray: { color: '#848E9C', fontSize: 13 },
  actionText: { color: '#8B5CF6', fontSize: 13, fontWeight: 'bold' },
});