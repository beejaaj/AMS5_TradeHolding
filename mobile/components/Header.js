import React, { useState, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  StatusBar
} from "react-native";
import { Feather } from "@expo/vector-icons"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Header = () => {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          setIsLogged(!!token);
        } catch (error) {
          console.log("Erro ao verificar token:", error);
        }
      };
      checkLogin();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userEmail'); // Se estiver salvando email
      setIsLogged(false);
      setMenuOpen(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (screen) => {
    setMenuOpen(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigateTo("Home")}>
             <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>Lunaria</Text>
             </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            {menuOpen ? (
              <Feather name="x" size={24} color="#fff" />
            ) : (
              <Feather name="menu" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* MENU DROPDOWN */}
      {menuOpen && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo("Home")}
          >
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo("CurrencyList")} 
          >
            <Text style={styles.menuText}>Moedas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo("Users")} 
          >
            <Text style={styles.menuText}>Usuários</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {isLogged ? (
            <>
              {/* Opção de Sair (na lista) */}
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.logoutContainer}>
                  <Feather name="log-out" size={18} color="#ef4444" />
                  <Text style={styles.logoutText}>Sair</Text>
                </View>
              </TouchableOpacity>

              {/* Botão Principal: Ver Perfil */}
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={() => navigateTo("Profile")}
              >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                   <Feather name="user" size={20} color="#000" />
                   <Text style={styles.loginButtonText}>Ver meu perfil</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            /* Botão Principal: Entrar */
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigateTo("Login")}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
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
    backgroundColor: "#000",
    zIndex: 100, 
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  
  // Menu Mobile Dropdown
  mobileMenu: {
    backgroundColor: "#111", 
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    // Se quiser que flutue sobre o conteúdo, descomente as linhas abaixo:
    // position: 'absolute',
    // top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 60 : 100,
    // width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  menuText: {
    color: "#e5e5e5",
    fontSize: 16,
  },
  divider: {
    height: 10,
  },
  
  // Botões de Ação
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    color: "#ef4444", 
    fontSize: 16,
    fontWeight: "600",
  }
});