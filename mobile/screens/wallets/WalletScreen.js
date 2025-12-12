import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti";

import { Header } from "../../components/Header"; 
import walletService from "../../services/walletService";
import userService from "../../services/userService";
import currencyService from "../../services/currencyService";

// --- SUB-COMPONENTE: MODAL DE CRIAÇÃO ---
const CreateWalletModal = ({ visible, onClose, onSuccess, userId }) => {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('BTC'); // Padrão
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega moedas disponíveis ao abrir o modal
    useEffect(() => {
        if(visible) loadCurrencies();
    }, [visible]);

    const loadCurrencies = async () => {
        try {
            const data = await currencyService.getAllCurrency();
            // Filtra apenas ativas se necessário
            setCurrencies(data);
            if(data.length > 0) setCurrency(data[0].symbol);
        } catch(e) {
            console.log(e);
        }
    }

    const handleSubmit = async () => {
        if (!name) {
            Alert.alert("Erro", "Digite um nome para a carteira.");
            return;
        }

        setLoading(true);
        try {
            await walletService.createWallet({
                userId: Number(userId),
                name,
                currencySymbol: currency
            });
            Alert.alert("Sucesso", "Carteira criada!");
            onSuccess(); // Recarrega a lista
            onClose();   // Fecha modal
            setName(''); // Limpa campo
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar a carteira.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nova Carteira</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#848E9C" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.label}>Nome da Carteira</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        placeholder="Ex: Minha Poupança" 
                        placeholderTextColor="#474D57"
                    />

                    <Text style={styles.label}>Escolha o Ativo</Text>
                    <ScrollView style={styles.currencyList} nestedScrollEnabled>
                        <View style={styles.currencyGrid}>
                            {currencies.map(c => (
                                <TouchableOpacity 
                                    key={c.id} 
                                    style={[styles.currencyOption, currency === c.symbol && styles.currencyOptionSelected]}
                                    onPress={() => setCurrency(c.symbol)}
                                >
                                    <Text style={[styles.currencyText, currency === c.symbol && {color: '#fff'}]}>{c.symbol}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.btnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.confirmBtn} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff"/> 
                            ) : (
                                <Text style={[styles.btnText, {fontWeight: 'bold'}]}>Criar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// --- TELA PRINCIPAL ---
export default function WalletsScreen() {
  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(null); // 'create' | null

  const fetchWallets = async () => {
    if (!refreshing) setLoading(true);
    try {
      // 1. Garante ID do usuário
      const user = await userService.getProfile();
      setUserId(user.id);

      // 2. Busca carteiras
      const data = await walletService.getUserWallets(user.id);
      setWallets(data);
    } catch (e) {
      console.error(e);
      // Se não estiver logado, o Header já tratou o redirect, 
      // mas podemos mostrar um alerta opcional aqui.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWallets();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallets();
  };

  // Renderização de cada Carteira
  const renderWalletItem = ({ item, index }) => (
    <MotiView 
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 100 }}
    >
        <TouchableOpacity 
            style={styles.walletCard} 
            activeOpacity={0.8}
            onPress={() => Alert.alert(item.name, `Saldo: ${item.balance} ${item.currencySymbol}`)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.symbolIcon}>
                    <Text style={styles.symbolIconText}>
                        {item.currencySymbol ? item.currencySymbol.substring(0, 2) : "$"}
                    </Text>
                </View>
                <View style={styles.symbolTag}>
                    <Text style={styles.symbolTagText}>{item.currencySymbol}</Text>
                </View>
            </View>

            <Text style={styles.walletName} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>
                    {item.balance ? item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "0,00"}
                </Text>
                <Text style={styles.balanceSymbol}>{item.currencySymbol}</Text>
            </View>
            
            {/* Decoração visual */}
            <View style={styles.glow} />
        </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" />

      <View style={styles.content}>
        
        {/* Cabeçalho da Página */}
        <View style={styles.pageHeader}>
            <View>
                <Text style={styles.pageTitle}>Minhas Carteiras</Text>
                <Text style={styles.pageSubtitle}>Gerencie seus saldos e ativos.</Text>
            </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsRow}>
            <TouchableOpacity 
                style={[styles.actionBtn, styles.createBtn]} 
                onPress={() => setModalVisible('create')}
            >
                <Feather name="plus" size={20} color="#fff" />
                <Text style={styles.createBtnText}>Nova Carteira</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => Alert.alert("Em Breve", "Funcionalidade de depósito via mobile.")}
            >
                <Feather name="download" size={20} color="#0ECB81" />
                <Text style={[styles.actionText, {color: '#0ECB81'}]}>Depositar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => Alert.alert("Em Breve", "Funcionalidade de trade via mobile.")}
            >
                <Feather name="repeat" size={20} color="#FCD535" />
                <Text style={[styles.actionText, {color: '#FCD535'}]}>Trade</Text>
            </TouchableOpacity>
        </View>

        {/* Lista */}
        {loading && !refreshing ? (
            <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={{color:'#666', marginTop: 10}}>Sincronizando...</Text>
            </View>
        ) : (
            <FlatList
                data={wallets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderWalletItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6"/>}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="pocket" size={48} color="#2B3139" />
                        <Text style={styles.emptyText}>Você ainda não possui carteiras.</Text>
                        <TouchableOpacity onPress={() => setModalVisible('create')}>
                            <Text style={styles.linkText}>Criar primeira carteira</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        )}
      </View>

      {/* Modal */}
      <CreateWalletModal 
        visible={modalVisible === 'create'} 
        onClose={() => setModalVisible(null)} 
        onSuccess={fetchWallets}
        userId={userId}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  content: { flex: 1, paddingHorizontal: 20 },
  
  // Page Header
  pageHeader: { marginTop: 20, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#EAECEF' },
  pageSubtitle: { fontSize: 14, color: '#848E9C' },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionBtn: { 
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, 
      paddingVertical: 12, borderRadius: 12, backgroundColor: '#1E2329', borderWidth: 1, borderColor: '#2B3139' 
  },
  createBtn: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', flex: 1.5 }, // Maior destaque
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  actionText: { fontWeight: 'bold', fontSize: 14 },

  // List
  listContent: { paddingBottom: 40 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  
  // Wallet Card
  walletCard: { 
      backgroundColor: '#1E2329', borderRadius: 20, padding: 20, marginBottom: 16, 
      borderWidth: 1, borderColor: '#2B3139', overflow: 'hidden', position: 'relative',
      shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  symbolIcon: { 
      width: 48, height: 48, borderRadius: 14, backgroundColor: '#0B0E11', 
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2B3139' 
  },
  symbolIconText: { color: '#8B5CF6', fontSize: 18, fontWeight: 'bold' },
  symbolTag: { 
      backgroundColor: '#2B3139', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, 
      height: 24, justifyContent: 'center' 
  },
  symbolTagText: { color: '#848E9C', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  walletName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  balanceValue: { 
      color: '#EAECEF', fontSize: 24, fontWeight: 'bold', 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' 
  },
  balanceSymbol: { color: '#848E9C', fontSize: 14 },
  glow: { 
      position: 'absolute', top: -40, right: -40, width: 120, height: 120, 
      backgroundColor: 'rgba(139, 92, 246, 0.05)', borderRadius: 60 
  },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { color: '#848E9C', fontSize: 16 },
  linkText: { color: '#8B5CF6', fontWeight: 'bold', fontSize: 16 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E2329', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#2B3139', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  
  label: { color: '#848E9C', marginBottom: 8, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { 
      backgroundColor: '#0B0E11', color: '#fff', padding: 14, borderRadius: 12, 
      borderWidth: 1, borderColor: '#2B3139', marginBottom: 20, fontSize: 16 
  },
  
  currencyList: { maxHeight: 200, marginBottom: 20 },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  currencyOption: { 
      paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, 
      borderWidth: 1, borderColor: '#2B3139', backgroundColor: '#0B0E11', flexGrow: 1, alignItems: 'center'
  },
  currencyOptionSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  currencyText: { color: '#848E9C', fontSize: 14, fontWeight: 'bold' },

  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#2B3139' },
  confirmBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#8B5CF6' },
  btnText: { color: '#fff', fontSize: 16 },
});