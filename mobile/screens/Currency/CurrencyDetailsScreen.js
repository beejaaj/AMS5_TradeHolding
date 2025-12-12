import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Componentes Modulares (Já criados)
import CurrencyChart from "../../components/CurrencyChart";
import CurrencyHistory from "../../components/CurrencyHistory";

const { width } = Dimensions.get("window");

export default function CurrencyDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currency } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header com Botões de Navegação */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{currency.symbol}</Text>
        
        <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate("CurrencyEdit", { id: currency.id })}
        >
            <Feather name="edit-2" size={20} color="#848E9C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* === INFO CARD (DETALHES) === */}
        <View style={styles.infoCard}>
            {/* Efeito Glow */}
            <View style={styles.glowEffect} />
            
            <View style={styles.infoHeader}>
                <View style={styles.bigIcon}>
                    <Text style={styles.bigIconText}>{currency.symbol.substring(0, 2)}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.coinName}>{currency.name}</Text>
                    
                    <View style={styles.badgesRow}>
                        {/* Badge Status */}
                        <View style={[styles.badge, currency.status === 'Ativo' ? styles.badgeActive : styles.badgeInactive]}>
                            <Text style={[styles.badgeText, currency.status === 'Ativo' ? {color: '#0ECB81'} : {color: '#F6465D'}]}>
                                {currency.status}
                            </Text>
                        </View>
                        
                        {/* Badge Lastro */}
                        <View style={styles.badgePurple}>
                            <Text style={styles.badgeTextPurple}>{currency.backing}</Text>
                        </View>
                    </View>
                </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.descLabel}>DESCRIÇÃO</Text>
            <Text style={styles.descText}>
                {currency.description || "Sem descrição disponível."}
            </Text>
        </View>

        {/* === GRÁFICO (COMPONENTE) === */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gráfico de Preço</Text>
            <CurrencyChart currencyId={currency.id} symbol={currency.symbol} />
        </View>

        {/* === HISTÓRICO (COMPONENTE) === */}
        <View style={styles.sectionContainer}>
            <CurrencyHistory currencyId={currency.id} />
        </View>

        <View style={{height: 40}} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15,
    backgroundColor: '#0B0E11', borderBottomWidth: 1, borderBottomColor: '#2B3139'
  },
  headerTitle: { color: '#EAECEF', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 8, backgroundColor: '#1E2329', borderRadius: 12, borderWidth: 1, borderColor: '#2B3139' },
  editButton: { padding: 8 },

  scrollContent: { padding: 20 },

  // INFO CARD
  infoCard: {
    backgroundColor: '#1E2329', borderRadius: 24, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#2B3139', overflow: 'hidden', position: 'relative',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  glowEffect: {
    position: 'absolute', top: -50, right: -50, width: 150, height: 150,
    backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 100, zIndex: -1
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bigIcon: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: '#0B0E11',
    borderWidth: 1, borderColor: '#2B3139', justifyContent: 'center', alignItems: 'center'
  },
  bigIconText: { color: '#8B5CF6', fontSize: 20, fontWeight: 'bold' },
  coinName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  badgesRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  
  // Badges
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeActive: { backgroundColor: 'rgba(14, 203, 129, 0.1)', borderColor: 'rgba(14, 203, 129, 0.2)' },
  badgeInactive: { backgroundColor: 'rgba(246, 70, 93, 0.1)', borderColor: 'rgba(246, 70, 93, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  badgePurple: { 
    backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6
  },
  badgeTextPurple: { color: '#8B5CF6', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  divider: { height: 1, backgroundColor: '#2B3139', marginVertical: 16 },
  descLabel: { color: '#848E9C', fontSize: 11, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
  descText: { color: '#EAECEF', fontSize: 14, lineHeight: 22 },

  // SEÇÕES
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { color: '#EAECEF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});