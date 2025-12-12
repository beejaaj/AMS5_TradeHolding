import React, { useState, useEffect, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  ScrollView
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti"; 

import { Header } from "../components/Header";
import userService from "../services/userService";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Se vier um ID (da lista de usuários), usa ele. 
  // Se não, é "null" e vamos buscar o perfil do logado ("me").
  const paramId = route.params?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recarrega os dados toda vez que a tela ganha foco (útil após edição)
  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [paramId])
  );

  const fetchUser = async () => {
    try {
      // setLoading(true); // Opcional: comentar para não piscar a tela no refresh
      let userData;

      if (paramId) {
        // Busca usuário específico (Visualização Admin)
        userData = await userService.getById(paramId);
      } else {
        // Busca meu próprio perfil
        userData = await userService.getProfile();
      }
      
      setUser(userData);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Verifica se a foto é válida (URL longa ou Base64)
  const hasPhoto = user?.photo && user.photo.length > 20 && user.photo !== "default.png";

  if (loading && !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Botão Voltar (apenas se não for a tab principal ou se veio de outra tela) */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#848E9C" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {user && (
          <MotiView 
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500 }}
            style={styles.profileCard}
          >
            {/* Efeito Glow no fundo */}
            <View style={styles.glowEffect} />

            {/* Cabeçalho do Card */}
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    {hasPhoto ? (
                        <Image 
                            source={{ uri: user.photo }} 
                            style={styles.avatarImage} 
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {user.name ? user.name.substring(0, 2).toUpperCase() : "??"}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userRole}>Membro da Lunaria</Text>
            </View>

            <View style={styles.detailsContainer}>
                
                <View style={styles.detailRow}>
                    <View style={styles.iconBox}>
                        <Feather name="mail" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.textGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <View style={styles.iconBox}>
                        <Feather name="phone" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.textGroup}>
                        <Text style={styles.label}>TELEFONE</Text>
                        <Text style={styles.value}>{user.phone || "Não informado"}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <View style={styles.iconBox}>
                        <Feather name="map-pin" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.textGroup}>
                        <Text style={styles.label}>ENDEREÇO</Text>
                        <Text style={styles.value}>{user.address || "Não informado"}</Text>
                    </View>
                </View>

            </View>

            {/* Botão Editar */}
            <TouchableOpacity 
                style={styles.editButton}
                // Passa o ID para a tela de edição saber quem editar
                onPress={() => navigation.navigate("UserEdit", { id: user.id })} 
            >
                <Feather name="edit-3" size={18} color="#EAECEF" />
                <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  backButton: {
    alignSelf: "flex-start",
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    padding: 5,
  },
  backText: { color: "#848E9C", marginLeft: 8, fontSize: 16, fontWeight: '500' },

  // CARD
  profileCard: {
    width: "100%",
    backgroundColor: "#1E2329",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2B3139",
    overflow: 'hidden',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  glowEffect: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 100,
  },

  // HEADER
  cardHeader: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2B3139',
    backgroundColor: '#1E2329',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    backgroundColor: '#0B0E11',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0E11' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#EAECEF' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  userRole: { fontSize: 14, color: '#848E9C' },

  // DETALHES
  detailsContainer: { padding: 24, gap: 16 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 14, 17, 0.5)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B3139',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textGroup: { flex: 1 },
  label: { color: '#848E9C', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  value: { color: '#EAECEF', fontSize: 15, fontWeight: '500' },

  // BOTÃO
  editButton: {
    margin: 24,
    marginTop: 0,
    backgroundColor: '#2B3139',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#474D57',
    gap: 8,
  },
  editButtonText: { color: '#EAECEF', fontWeight: 'bold', fontSize: 16 }
});