import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Platform,
  StatusBar
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Equivalente ao Lucide
import { useNavigation } from "@react-navigation/native";

// Se estiver usando autenticação real:
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const Header = () => {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Simulação de verificação de token (substitua por AsyncStorage.getItem('token'))
    const checkLogin = async () => {
      // const token = await AsyncStorage.getItem('token');
      const token = null; // Mude para true/string para testar logado
      setIsLogged(!!token);
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    // await AsyncStorage.removeItem('token');
    setIsLogged(false);
    setMenuOpen(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Certifique-se que a rota Login existe
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função auxiliar para navegar e fechar o menu
  const navigateTo = (screen) => {
    setMenuOpen(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Ajuste para a barra de status (Safe Area) */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navBar}>
          
          {/* LOGO */}
          <TouchableOpacity onPress={() => navigateTo("Home")}>
             {/* Se tiver a imagem no projeto, use require ou uri */}
             {/* <Image source={require('../assets/Lunaria.jpg')} style={styles.logoImage} /> */}
             
             {/* Placeholder visual caso não tenha a imagem ainda */}
             <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>Lunaria</Text>
             </View>
          </TouchableOpacity>

          {/* BOTÃO DO MENU (Hambúrguer / X) */}
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            {menuOpen ? (
              <Feather name="x" size={24} color="#fff" />
            ) : (
              <Feather name="menu" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* MENU DROPDOWN (Expandível) */}
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
            onPress={() => navigateTo("Currency")}
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
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.logoutContainer}>
                <Feather name="log-out" size={18} color="#ef4444" />
                <Text style={styles.logoutText}>Sair</Text>
              </View>
            </TouchableOpacity>
          ) : (
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
    backgroundColor: "#000", // Fundo preto igual ao Web
    zIndex: 10, // Garante que o menu fique sobre o conteúdo
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
  // Estilos da Logo
  logoImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain'
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
    backgroundColor: "#111", // Um pouco mais claro que o fundo
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
    marginTop: 10,
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
    color: "#ef4444", // Vermelho
    fontSize: 16,
    fontWeight: "600",
  }
});