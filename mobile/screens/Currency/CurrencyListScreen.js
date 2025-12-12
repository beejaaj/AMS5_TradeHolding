import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Alert,
  Platform
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti"; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import necessário

import currencyService from "../../services/currencyService";
import { Header } from "../../components/Header";

export default function CurrencyListScreen() {
  const navigation = useNavigation();
  
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // VERIFICAÇÃO DE LOGIN + CARREGAMENTO DE DADOS
  useFocusEffect(
    useCallback(() => {
      const checkAuthAndFetch = async () => {
        try {
          // 1. Verifica Token
          const token = await AsyncStorage.getItem('token');
          if (!token) {
             Alert.alert("Acesso Restrito", "Faça login para ver o mercado.");
             navigation.navigate("Login"); // Redireciona
             return;
          }

          // 2. Se logado, busca moedas
          if (!refreshing) setLoading(true);
          const data = await currencyService.getAllCurrency();
          setCurrencies(data);
          setFilteredCurrencies(data);

        } catch (err) {
          console.error(err);
          // Se o erro for 401 vindo da API, também redireciona
          if (err.response?.status === 401) {
              await AsyncStorage.removeItem('token');
              navigation.navigate("Login");
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      };

      checkAuthAndFetch();
    }, [])
  );

  // ... (Restante das funções: handleSearch, handleDelete, confirmDelete, onRefresh permanecem iguais) ...

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = currencies.filter(c => 
        c.name.toLowerCase().includes(text.toLowerCase()) || 
        c.symbol.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    } else {
      setFilteredCurrencies(currencies);
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja excluir esta moeda?")) confirmDelete(id);
    } else {
      Alert.alert("Excluir Ativo", "Tem certeza? O histórico também será perdido.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => confirmDelete(id) }
      ]);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await currencyService.deleteCurrency(id);
      const newList = currencies.filter(c => c.id !== id);
      setCurrencies(newList);
      setFilteredCurrencies(newList);
    } catch (err) {
      Alert.alert("Erro", "Falha ao excluir.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Como a lógica principal está no useFocusEffect, podemos chamar fetchCurrencies separado ou recarregar tudo
    // Aqui vou replicar a chamada simples para o refresh
    currencyService.getAllCurrency().then(data => {
        setCurrencies(data);
        setFilteredCurrencies(data);
        setRefreshing(false);
    }).catch(() => setRefreshing(false));
  };

  // ... (renderItem e return permanecem iguais) ...
  
  const renderItem = ({ item, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 50 }}
    >
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("CurrencyDetails", { currency: item })}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{item.symbol.substring(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.coinSymbol}>{item.symbol}</Text>
            <Text style={styles.coinName} numberOfLines={1}>{item.name}</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{item.backing}</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Feather name="trash-2" size={18} color="#474D57" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.contentContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Mercado</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate("CurrencyCreate")}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#848E9C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ativos..."
            placeholderTextColor="#474D57"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : (
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6"/>
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum ativo encontrado.</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E11",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EAECEF',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    padding: 10,
    borderRadius: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2329',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B3139',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#EAECEF',
    paddingVertical: 12,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2329',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2B3139',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0B0E11',
    borderWidth: 1,
    borderColor: '#2B3139',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 12,
  },
  coinSymbol: {
    color: '#EAECEF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinName: {
    color: '#848E9C',
    fontSize: 12,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actionButton: {
    padding: 6,
  },
  centerLoading: {
    marginTop: 50,
  },
  emptyText: {
    color: '#848E9C',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});