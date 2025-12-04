import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// 1. IMPORTE O SERVIÇO
import currencyService from "../../services/currencyService";

export default function CurrencyListScreen({ onSelect }) {
  const navigation = useNavigation();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCurrencies();
    }, [])
  );

  async function fetchCurrencies() {
    if (!refreshing) setLoading(true);
    setError("");
    try {
      // 2. CHAMADA REAL
      const data = await currencyService.getAllCurrency();
      setCurrencies(data);
    } catch (err) {
      setError("Erro ao carregar as moedas.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleDelete = (id) => {
    Alert.alert("Confirmar exclusão", "Deseja excluir esta moeda?", [
      { text: "Cancelar", style: "cancel", onPress: () => setMenuOpenId(null) },
      { text: "Excluir", style: "destructive", onPress: async () => await confirmDelete(id) }
    ]);
  };

  const confirmDelete = async (id) => {
    setDeleting(true);
    try {
      // 3. CHAMADA REAL
      await currencyService.deleteCurrency(id);
      
      setCurrencies(prev => prev.filter(c => c.id !== id));
      Alert.alert("Sucesso", "Moeda excluída.");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível excluir.");
    } finally {
      setDeleting(false);
      setMenuOpenId(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrencies();
  }

  // ... (Funções handleSelect, toggleMenu, handleEdit mantêm-se iguais) ...
  const handleSelect = (item) => { setSelectedId(item.id); setMenuOpenId(null); if (onSelect) onSelect(item); };
  const toggleMenu = (id) => { setMenuOpenId(prev => prev === id ? null : id); };
  const handleEdit = (id) => { setMenuOpenId(null); navigation.navigate("CurrencyEdit", { id }); };

  const renderItem = ({ item }) => (
    <View style={styles.itemWrapper}>
        <TouchableOpacity
            style={[styles.itemContainer, selectedId === item.id && styles.itemSelected]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.symbolText}>{item.symbol}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={() => toggleMenu(item.id)}>
                <Feather name="more-vertical" size={24} color="#ccc" />
            </TouchableOpacity>
        </TouchableOpacity>

        {menuOpenId === item.id && (
            <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleEdit(item.id)}>
                    <Feather name="edit-2" size={16} color="#fff" />
                    <Text style={styles.dropdownText}>Editar</Text>
                </TouchableOpacity>
                <View style={styles.dropdownDivider} />
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleDelete(item.id)}>
                    <Feather name="trash-2" size={16} color="#f87171" />
                    <Text style={[styles.dropdownText, { color: '#f87171' }]}>Excluir</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Moedas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CurrencyCreate")}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Nova Moeda</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#5c1a75" />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
            data={currencies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d8b4fe"/>}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma moeda cadastrada.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 50, backgroundColor: "#000", borderBottomWidth: 1, borderBottomColor: "#333" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  addButton: { flexDirection: "row", backgroundColor: "#5c1a75", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", gap: 8 },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  listContent: { padding: 20, paddingBottom: 100 },
  itemWrapper: { marginBottom: 12, position: 'relative', zIndex: 1 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1a001f", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#333" },
  itemSelected: { borderColor: "#d8b4fe", backgroundColor: "#2d0036" },
  itemInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  symbolText: { color: "#d8b4fe", fontWeight: "bold", fontSize: 16, width: 50 },
  nameText: { color: "#fff", fontSize: 16 },
  menuButton: { padding: 8 },
  dropdownMenu: { position: 'absolute', right: 50, top: 10, backgroundColor: "#222", borderRadius: 8, padding: 5, zIndex: 999, borderWidth: 1, borderColor: "#444", minWidth: 120 },
  dropdownItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, gap: 8 },
  dropdownText: { color: "#fff", fontSize: 14 },
  dropdownDivider: { height: 1, backgroundColor: "#444", marginHorizontal: 5 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#f87171", fontSize: 16 },
  emptyText: { color: "#666", textAlign: "center", marginTop: 20, fontSize: 16 },
});