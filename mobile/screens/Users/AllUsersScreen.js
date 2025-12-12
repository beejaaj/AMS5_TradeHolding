import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Image,
  Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti"; // Animação de entrada

import userService from "../../services/userService";
import { Header } from "../../components/Header";

export default function AllUsersScreen() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Carrega usuários ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = async () => {
    if (!refreshing) setLoading(true);
    setError("");

    try {
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data); // Inicializa filtro
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
          Alert.alert("Sessão Expirada", "Faça login novamente.");
          navigation.navigate("Login");
      } else {
          setError("Não foi possível carregar os usuários.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Filtro de Busca
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
        const filtered = users.filter(u => 
            u.name.toLowerCase().includes(text.toLowerCase()) || 
            u.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    } else {
        setFilteredUsers(users);
    }
  };

  const handleDelete = (userId) => {
    if (Platform.OS === 'web') {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) confirmDelete(userId);
    } else {
        Alert.alert(
          "Excluir Usuário",
          "Tem certeza que deseja excluir este usuário permanentemente?",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Excluir", 
              style: "destructive", 
              onPress: async () => await confirmDelete(userId) 
            }
          ]
        );
    }
  };

  const confirmDelete = async (userId) => {
    setDeletingId(userId);
    try {
      await userService.delete(userId);
      
      const newList = users.filter(u => u.id !== userId);
      setUsers(newList);
      setFilteredUsers(newList);
      
      if (Platform.OS !== 'web') Alert.alert("Sucesso", "Usuário excluído.");

    } catch (err) {
      Alert.alert("Erro", "Falha ao excluir usuário.");
    } finally {
      setDeletingId(null);
    }
  };

  const renderItem = ({ item, index }) => {
    const hasPhoto = item.photo && item.photo.length > 50 && item.photo !== "default.png";

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 50 }}
        >
            <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.7}
                // Ao clicar no card, vai para o perfil daquele usuário (passando ID)
                onPress={() => navigation.navigate("Profile", { id: item.id })}
            >
                <View style={styles.cardHeader}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        {hasPhoto ? (
                            <Image source={{ uri: item.photo }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {item.name ? item.name.substring(0, 2).toUpperCase() : "??"}
                            </Text>
                        )}
                    </View>
                    
                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardEmail} numberOfLines={1}>{item.email}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ações */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate("Profile", { id: item.id })}
                    >
                        <Feather name="eye" size={18} color="#848E9C" />
                        <Text style={styles.actionText}>Ver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate("UserEdit", { id: item.id })}
                    >
                        <Feather name="edit-2" size={18} color="#8B5CF6" />
                        <Text style={[styles.actionText, {color: '#8B5CF6'}]}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteBtn]}
                        onPress={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                    >
                        {deletingId === item.id ? (
                            <ActivityIndicator size="small" color="#F6465D" />
                        ) : (
                            <>
                                <Feather name="trash-2" size={18} color="#F6465D" />
                                <Text style={[styles.actionText, {color: '#F6465D'}]}>Excluir</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" />
      
      <View style={styles.content}>
        
        {/* Título e Botão Criar */}
        <View style={styles.pageHeader}>
            <View>
                <Text style={styles.pageTitle}>Usuários</Text>
                <Text style={styles.pageSubtitle}>Gerenciamento de contas</Text>
            </View>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate("AddUser")}
            >
                <Feather name="user-plus" size={20} color="#fff" />
            </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#848E9C" style={styles.searchIcon}/>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou email..."
                placeholderTextColor="#474D57"
                value={search}
                onChangeText={handleSearch}
            />
        </View>

        {/* Lista */}
        {loading && !refreshing ? (
            <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        ) : error ? (
            <View style={styles.centerLoading}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchUsers}>
                    <Text style={{color: '#8B5CF6', marginTop: 10}}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#8B5CF6" />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
                }
            />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  content: { flex: 1, paddingHorizontal: 20 },
  
  // Page Header
  pageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: "bold", color: "#EAECEF" },
  pageSubtitle: { fontSize: 14, color: "#848E9C" },
  addButton: { backgroundColor: "#8B5CF6", padding: 12, borderRadius: 12, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E2329', borderRadius: 12, borderWidth: 1, borderColor: '#2B3139', marginBottom: 20, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#EAECEF', paddingVertical: 12, fontSize: 14 },

  // List
  listContent: { paddingBottom: 40 },
  centerLoading: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#F6465D", fontSize: 16 },
  emptyText: { color: "#848E9C", textAlign: "center", marginTop: 40, fontStyle: 'italic' },

  // Card
  card: { backgroundColor: "#1E2329", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2B3139" },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  
  avatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0B0E11', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#474D57', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#8B5CF6', fontWeight: 'bold', fontSize: 16 },
  
  infoContainer: { flex: 1 },
  cardName: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  cardEmail: { color: "#848E9C", fontSize: 12 },

  divider: { height: 1, backgroundColor: '#2B3139', marginVertical: 12 },

  actionsContainer: { flexDirection: "row", justifyContent: 'space-between', gap: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#0B0E11', borderWidth: 1, borderColor: '#2B3139' },
  deleteBtn: { borderColor: 'rgba(246, 70, 93, 0.3)', backgroundColor: 'rgba(246, 70, 93, 0.05)' },
  actionText: { fontSize: 12, fontWeight: '600', color: '#848E9C' },
});