import React, { useState, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  Image
} from "react-native";
import { Feather } from "@expo/vector-icons"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import userService from "../services/userService";

export const Header = () => {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estados do Usuário
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  
  // Carregar dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          
          if (token) {
            // Tenta buscar o perfil
            try {
                const user = await userService.getProfile();
                setIsLogged(true);
                
                // Verifica e seta a foto
                if (user.photo && user.photo.length > 50 && user.photo !== "default.png") {
                    setUserPhoto(user.photo);
                } else {
                    setUserPhoto(null);
                }

                // Verifica se é Admin (ID 31 ou 32 conforme sua regra web)
                if (String(user.id) === "31" || String(user.id) === "32") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

            } catch (profileError) {
                console.log("Erro ao validar token:", profileError.message);

                // --- PROTEÇÃO CONTRA LOOP 401 ---
                // Se o token for inválido, limpa tudo para deslogar
                if (profileError.response && profileError.response.status === 401) {
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('userEmail');
                    setIsLogged(false);
                    setIsAdmin(false);
                    setUserPhoto(null);
                }
            }
          } else {
            // Não tem token
            setIsLogged(false);
            setIsAdmin(false);
            setUserPhoto(null);
          }
        } catch (error) {
          console.log("Erro geral no header:", error);
        }
      };
      loadUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userEmail');
      
      setIsLogged(false);
      setIsAdmin(false);
      setUserPhoto(null);
      setMenuOpen(false);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const navigateTo = (screen, params) => {
    setMenuOpen(false);
    navigation.navigate(screen, params);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navBar}>
          
          {/* Logo / Home */}
          <TouchableOpacity onPress={() => navigateTo("Home")}>
             <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>Lunaria</Text>
             </View>
          </TouchableOpacity>

          {/* Botão Menu / Foto do Usuário (se fechado) */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
              
              {/* Atalho de Perfil (Só aparece se logado e menu fechado) */}
              {isLogged && !menuOpen && (
                  <TouchableOpacity onPress={() => navigateTo("Profile")}>
                      <View style={styles.headerAvatarContainer}>
                          {userPhoto ? (
                              <Image source={{ uri: userPhoto }} style={styles.headerAvatar} />
                          ) : (
                              <Feather name="user" size={18} color="#8B5CF6" />
                          )}
                      </View>
                  </TouchableOpacity>
              )}

              <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                {menuOpen ? (
                  <Feather name="x" size={24} color="#fff" />
                ) : (
                  <Feather name="menu" size={24} color="#fff" />
                )}
              </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>

      {/* MENU DROPDOWN */}
      {menuOpen && (
        <View style={styles.mobileMenu}>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Home")}>
            <View style={styles.menuItemContent}>
                <Feather name="home" size={18} color="#848E9C" />
                <Text style={styles.menuText}>Dashboard</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("CurrencyList")}>
            <View style={styles.menuItemContent}>
                <Feather name="bar-chart-2" size={18} color="#848E9C" />
                <Text style={styles.menuText}>Mercado</Text>
            </View>
          </TouchableOpacity>

          {isLogged && (
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Wallets")}>
                <View style={styles.menuItemContent}>
                    <Feather name="pocket" size={18} color="#848E9C" />
                    <Text style={styles.menuText}>Minhas Carteiras</Text>
                </View>
              </TouchableOpacity>
          )}

          {isLogged && isAdmin && (
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("AllUsers")}>
                <View style={styles.menuItemContent}>
                    <Feather name="users" size={18} color="#8B5CF6" /> 
                    <Text style={[styles.menuText, {color: '#8B5CF6'}]}>Gerenciar Usuários</Text>
                </View>
              </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {isLogged ? (
            <>
              <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => navigateTo("Profile")}
              >
                <View style={styles.profileButtonContent}>
                   <View style={styles.largeAvatarContainer}>
                      {userPhoto ? (
                          <Image source={{ uri: userPhoto }} style={styles.largeAvatar} />
                      ) : (
                          <Feather name="user" size={24} color="#000" />
                      )}
                   </View>
                   <Text style={styles.profileButtonText}>Minha Conta</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <View style={styles.logoutContainer}>
                  <Feather name="log-out" size={18} color="#ef4444" />
                  <Text style={styles.logoutText}>Sair da conta</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigateTo("Login")}
            >
              <Text style={styles.loginButtonText}>Entrar na Plataforma</Text>
              <Feather name="log-in" size={18} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#0B0E11",
    zIndex: 100, 
    borderBottomWidth: 1,
    borderBottomColor: "#2B3139",
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  headerAvatarContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#2B3139',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#474D57',
      overflow: 'hidden'
  },
  headerAvatar: { width: '100%', height: '100%' },
  mobileMenu: {
    backgroundColor: "#15181D",
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#2B3139",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#2B3139" },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { color: "#EAECEF", fontSize: 16, fontWeight: '500' },
  divider: { height: 20 },
  profileButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  largeAvatarContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
  },
  largeAvatar: { width: '100%', height: '100%' },
  profileButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  loginButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  logoutButton: { paddingVertical: 12, alignItems: 'center' },
  logoutContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoutText: { color: "#ef4444", fontSize: 15, fontWeight: "600" }
});