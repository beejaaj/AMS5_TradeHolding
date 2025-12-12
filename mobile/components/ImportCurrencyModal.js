import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";

import currencyService from "../services/currencyService";

// Lista simulada (igual ao web)
const BINANCE_COINS = [
  { symbol: "USD", name: "United States Dollar", backing: "Fiat" }, 
  { symbol: "USDT", name: "Tether USD", backing: "USD" },
  { symbol: "BTC", name: "Bitcoin", backing: "USDT" },
  { symbol: "ETH", name: "Ethereum", backing: "USDT" },
  { symbol: "BNB", name: "Binance Coin", backing: "USDT" },
  { symbol: "SOL", name: "Solana", backing: "USDT" },
  { symbol: "ADA", name: "Cardano", backing: "USDT" },
  { symbol: "XRP", name: "Ripple", backing: "USDT" },
  { symbol: "DOT", name: "Polkadot", backing: "USDT" },
  { symbol: "DOGE", name: "Dogecoin", backing: "USDT" },
  { symbol: "LTC", name: "Litecoin", backing: "USDT" },
  { symbol: "MATIC", name: "Polygon", backing: "USDT" },
  { symbol: "AVAX", name: "Avalanche", backing: "USDT" },
  { symbol: "LINK", name: "Chainlink", backing: "USDT" },
];

export default function ImportCurrencyModal({ visible, onClose, onSuccess }) {
  const [search, setSearch] = useState("");
  const [importingSymbol, setImportingSymbol] = useState(null);

  const filteredCoins = BINANCE_COINS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleImport = async (coin) => {
    setImportingSymbol(coin.symbol);
    try {
      const payload = {
        symbol: coin.symbol,
        name: coin.name,
        description: `Ativo importado da Binance (${coin.name})`,
        status: "Ativo",
        backing: coin.backing,
        reverse: false
      };

      await currencyService.registerCurrency(payload);
      
      Alert.alert("Sucesso", `${coin.symbol} importado com sucesso!`);
      onSuccess(); // Atualiza a lista na tela pai
      onClose();   // Fecha o modal
      setSearch("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível importar. Verifique se já existe.");
    } finally {
      setImportingSymbol(null);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
        style={styles.coinItem} 
        onPress={() => handleImport(item)}
        disabled={importingSymbol !== null}
    >
        <View style={styles.coinInfo}>
            <View style={styles.coinIcon}>
                <Text style={styles.coinIconText}>{item.symbol[0]}</Text>
            </View>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <Text style={styles.coinSymbol}>{item.symbol}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.backing}</Text>
                    </View>
                </View>
                <Text style={styles.coinName}>{item.name}</Text>
            </View>
        </View>

        {importingSymbol === item.symbol ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
        ) : (
            <Feather name="download" size={20} color="#848E9C" />
        )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                
                {/* Header */}
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <FontAwesome5 name="coins" size={20} color="#8B5CF6" />
                        <Text style={styles.title}>Importar da Binance</Text>
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color="#848E9C" />
                    </TouchableOpacity>
                </View>

                {/* Busca */}
                <View style={styles.searchBox}>
                    <Feather name="search" size={18} color="#848E9C" />
                    <TextInput 
                        style={styles.input}
                        placeholder="Buscar ativo (ex: BTC)..."
                        placeholderTextColor="#474D57"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Lista */}
                <FlatList 
                    data={filteredCoins}
                    keyExtractor={item => item.symbol}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Nenhum ativo encontrado.</Text>
                    }
                />
            </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E2329', borderRadius: 24, padding: 20, maxHeight: '80%', width: '100%' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#EAECEF' },
  
  searchBox: { 
      flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B0E11', 
      borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2B3139', marginBottom: 16 
  },
  input: { flex: 1, color: '#EAECEF', paddingVertical: 12, marginLeft: 8, fontSize: 14 },

  listContent: { paddingBottom: 20 },
  
  coinItem: { 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2B3139' 
  },
  coinInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinIcon: { 
      width: 40, height: 40, borderRadius: 20, backgroundColor: '#2B3139', 
      justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#474D57' 
  },
  coinIconText: { color: '#EAECEF', fontWeight: 'bold' },
  coinSymbol: { color: '#EAECEF', fontWeight: 'bold', fontSize: 16 },
  coinName: { color: '#848E9C', fontSize: 12 },
  
  badge: { backgroundColor: '#2B3139', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#474D57' },
  badgeText: { color: '#848E9C', fontSize: 10, fontWeight: 'bold' },

  emptyText: { color: '#848E9C', textAlign: 'center', marginTop: 20, fontStyle: 'italic' }
});