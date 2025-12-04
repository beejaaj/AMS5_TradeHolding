import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Importe sua API e Tipos aqui
// import { currencyAPI } from "@/services/API";
// import { Currency } from "../../services/types";

// Mock de dados e API para o exemplo funcionar visualmente
const MOCK_API = {
    getAllCurrency: async () => [
        { id: 1, name: "Bitcoin", symbol: "BTC" },
        { id: 2, name: "Ethereum", symbol: "ETH" },
        { id: 3, name: "Cardano", symbol: "ADA" },
    ]
};

export default function CurrencyListScreen({ onSelect }) {
  const navigation = useNavigation();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  async function fetchCurrencies() {
    setLoading(true);
    setError("");
    try {
      // const res = await fetch(currencyAPI.getAllCurrency()...)
      
      // Simulação:
      await new Promise(r => setTimeout(r, 1000));
      const data = await MOCK_API.getAllCurrency();
      
      setCurrencies(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar as moedas.");
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (currency) => {
    setSelectedId(currency.id);
    setMenuOpenId(null);
    if (onSelect) {
      onSelect(currency);
    }
  };

  const toggleMenu = (id) => {
    // Se clicar no mesmo, fecha. Se for outro, abre o novo e fecha o anterior.
    setMenuOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleEdit = (id) => {
    setMenuOpenId(null);
    navigation.navigate("CurrencyEdit", { id }); 
  };

  const handleDelete = (id) => {
    const currencyToDelete = currencies.find((c) => c.id === id);
    if (!currencyToDelete) return;

    // Substituto do window.confirm
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir ${currencyToDelete.name}?`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setMenuOpenId(null) },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            await confirmDelete(id);
          }
        }
      ]
    );
  };

  const confirmDelete = async (id) => {
    setDeleting(true);
    try {
      // await fetch(currencyAPI.deleteCurrency(id)...)
      
      // Simulação
      await new Promise(r => setTimeout(r, 1000));
      
      Alert.alert("Sucesso", "Moeda excluída com sucesso!");

      if (selectedId === id) {
        setSelectedId(null);
        if (onSelect) onSelect(null);
      }
      
      // Atualizar lista localmente ou fazer refetch
      setCurrencies(prev => prev.filter(c => c.id !== id));
      
    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao excluir moeda");
    } finally {
      setDeleting(false);
      setMenuOpenId(null);
    }
  };

  // Renderização de cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemWrapper}>
        <TouchableOpacity
            style={[
                styles.itemContainer,
                selectedId === item.id && styles.itemSelected
            ]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.symbolText}>{item.symbol}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>

            {/* Botão de 3 pontos */}
            <TouchableOpacity 
                style={styles.menuButton} 
                onPress={() => toggleMenu(item.id)}
            >
                <Feather name="more-vertical" size={24} color="#ccc" />
            </TouchableOpacity>
        </TouchableOpacity>

        {/* Menu Dropdown (Renderizado condicionalmente sobre o item) */}
        {menuOpenId === item.id && (
            <View style={styles.dropdownMenu}>
                <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => handleEdit(item.id)}
                >
                    <Feather name="edit-2" size={16} color="#fff" />
                    <Text style={styles.dropdownText}>Editar</Text>
                </TouchableOpacity>
                
                <View style={styles.dropdownDivider} />

                <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => handleDelete(item.id)}
                >
                    <Feather name="trash-2" size={16} color="#f87171" />
                    <Text style={[styles.dropdownText, { color: '#f87171' }]}>
                        {deleting ? "..." : "Excluir"}
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Moedas</Text>
        <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("CurrencyCreate")}
        >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Nova Moeda</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {loading && currencies.length === 0 ? (
        <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#5c1a75" />
            <Text style={styles.loadingText}>Carregando moedas...</Text>
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
            ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma moeda cadastrada.</Text>
            }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // bg-main
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50, // Espaço para StatusBar
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#5c1a75", // bg-panel
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Lista
  listContent: {
    padding: 20,
    paddingBottom: 100, // Espaço extra no final
  },
  itemWrapper: {
    marginBottom: 12,
    position: 'relative', // Importante para o dropdown absoluto funcionar
    zIndex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a001f",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemSelected: {
    borderColor: "#d8b4fe",
    backgroundColor: "#2d0036",
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  symbolText: {
    color: "#d8b4fe",
    fontWeight: "bold",
    fontSize: 16,
    width: 50,
  },
  nameText: {
    color: "#fff",
    fontSize: 16,
  },
  menuButton: {
    padding: 8,
  },

  // Dropdown Menu
  dropdownMenu: {
    position: 'absolute',
    right: 50, // Posiciona à esquerda do botão de 3 pontos
    top: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 5,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
    minWidth: 120,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 14,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#444",
    marginHorizontal: 5,
  },

  // Estados de Loading/Vazio
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});