import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// import { userAPI } from "@/services/API";

export default function AllUsersScreen() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Estado para o "puxar para atualizar"
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // useFocusEffect garante que a lista atualize sempre que você voltar para essa tela
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = async () => {
    // Evita loading duplo se for um refresh manual
    if (!refreshing) setLoading(true);
    
    setError("");

    try {
      // --- API REAL ---
      /*
      // Em React Native, pegamos o token do AsyncStorage ou Contexto
      // const token = await AsyncStorage.getItem('token'); 
      const token = "token_simulado"; 
      
      const res = await fetch(userAPI.getAll(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao carregar os usuários');
      const data = await res.json();
      setUsers(data);
      */

      // --- SIMULAÇÃO ---
      await new Promise(r => setTimeout(r, 1000));
      setUsers([
        { id: 1, name: "Maria Silva", email: "maria@teste.com", phone: "(11) 99999-0000" },
        { id: 2, name: "João Santos", email: "joao@teste.com", phone: "(21) 98888-1111" },
        { id: 3, name: "Ana Costa", email: "ana@teste.com", phone: "(31) 97777-2222" },
      ]);

    } catch (err) {
      setError(err.message || "Erro ao carregar lista.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleDelete = (userId) => {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => await confirmDelete(userId) 
        }
      ]
    );
  };

  const confirmDelete = async (userId) => {
    setDeletingId(userId);
    try {
      // --- API REAL ---
      /*
      // const token = await AsyncStorage.getItem('token');
      await fetch(userAPI.delete(userId), { ... });
      */

      // --- SIMULAÇÃO ---
      await new Promise(r => setTimeout(r, 1000));
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      Alert.alert("Sucesso", "Usuário excluído com sucesso!");

    } catch (err) {
      Alert.alert("Erro", "Falha ao excluir usuário.");
    } finally {
      setDeletingId(null);
    }
  };

  // Renderiza cada cartão de usuário
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDetail}>{item.email}</Text>
        <Text style={styles.cardDetail}>{item.phone}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {/* Botão Ver */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewBtn]}
          onPress={() => navigation.navigate("UserProfile", { id: item.id })}
        >
          <Feather name="eye" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão Editar */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.editBtn]}
          onPress={() => navigation.navigate("UserEdit", { id: item.id })}
        >
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão Excluir */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
             <ActivityIndicator size="small" color="#fff" />
          ) : (
             <Feather name="trash-2" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Fixo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Usuários</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateAccount")} // Reutilizando tela de criar
        >
           <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#5c1a75" />
          <Text style={styles.loadingText}>Carregando usuários...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerLoading}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#d8b4fe" // Cor do loading no iOS
              colors={["#d8b4fe"]} // Cor do loading no Android
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // StatusBar spacing
    paddingBottom: 20,
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
    padding: 8,
    backgroundColor: "#1a001f",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },

  // Lista e Cartões
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#1a001f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDetail: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 2,
  },

  // Botões de Ação
  actionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBtn: {
    backgroundColor: "#3b82f6", // Azul
  },
  editBtn: {
    backgroundColor: "#f59e0b", // Laranja/Amarelo
  },
  deleteBtn: {
    backgroundColor: "#ef4444", // Vermelho
  },

  // Estados
  centerLoading: {
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
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});