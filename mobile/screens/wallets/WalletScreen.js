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

// --- MODAL: CRIAR CARTEIRA ---
const CreateWalletModal = ({ visible, onClose, onSuccess, userId }) => {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('BTC');
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { if(visible) loadCurrencies(); }, [visible]);

    const loadCurrencies = async () => {
        try {
            const data = await currencyService.getAllCurrency();
            setCurrencies(data);
            if(data.length > 0) setCurrency(data[0].symbol);
        } catch(e) {}
    }

    const handleSubmit = async () => {
        if (!name) return Alert.alert("Erro", "Digite um nome.");
        setLoading(true);
        try {
            await walletService.createWallet({ userId: Number(userId), name, currency: currency });
            Alert.alert("Sucesso", "Carteira criada!");
            onSuccess(); onClose(); setName('');
        } catch (error) { Alert.alert("Erro", "Falha ao criar carteira."); } 
        finally { setLoading(false); }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nova Carteira</Text>
                        <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#848E9C" /></TouchableOpacity>
                    </View>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Poupança" placeholderTextColor="#666" />
                    <Text style={styles.label}>Moeda</Text>
                    <ScrollView style={styles.listScroll} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.optionsRow}>
                            {currencies.map(c => (
                                <TouchableOpacity key={c.id} style={[styles.optionChip, currency === c.symbol && styles.optionChipSelected]} onPress={() => setCurrency(c.symbol)}>
                                    <Text style={[styles.optionText, currency === c.symbol && {color:'#fff'}]}>{c.symbol}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={handleSubmit} style={styles.confirmBtn} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Criar</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// --- MODAL: DEPOSITAR ---
const DepositModal = ({ visible, onClose, onSuccess, wallets, userId }) => {
    const [walletId, setWalletId] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!walletId || !amount) return Alert.alert("Erro", "Selecione a carteira e o valor.");
        setLoading(true);
        try {
            await walletService.deposit({ userId: Number(userId), walletId: Number(walletId), amount: parseFloat(amount) });
            Alert.alert("Sucesso", "Depósito realizado!");
            onSuccess(); onClose(); setAmount(''); setWalletId(null);
        } catch (error) { Alert.alert("Erro", "Falha no depósito."); }
        finally { setLoading(false); }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Depositar</Text>
                        <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#848E9C" /></TouchableOpacity>
                    </View>
                    
                    <Text style={styles.label}>Escolha a Carteira</Text>
                    <ScrollView style={styles.listScroll} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.optionsRow}>
                            {wallets.map(w => (
                                <TouchableOpacity key={w.id} style={[styles.optionChip, walletId === w.id && styles.optionChipGreen]} onPress={() => setWalletId(w.id)}>
                                    <Text style={[styles.optionText, walletId === w.id && {color:'#fff'}]}>{w.name} ({w.currency})</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text style={styles.label}>Valor</Text>
                    <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#666" />
                    
                    <TouchableOpacity onPress={handleSubmit} style={[styles.confirmBtn, {backgroundColor: '#0ECB81'}]} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Confirmar Depósito</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// --- MODAL: TRADE ---
const TradeModal = ({ visible, onClose, onSuccess, wallets, userId }) => {
    const [fromWalletId, setFromWalletId] = useState(null);
    const [toCurrency, setToCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { if(visible) loadCurrencies(); }, [visible]);

    const loadCurrencies = async () => {
        try {
            const data = await currencyService.getAllCurrency();
            setCurrencies(data);
            if(data.length > 0) setToCurrency(data[0].symbol);
        } catch(e) {}
    }

    const handleSubmit = async () => {
        if (!fromWalletId || !amount) return Alert.alert("Erro", "Preencha todos os dados.");
        setLoading(true);
        try {
            await walletService.trade({
                userId: Number(userId),
                fromWalletId: Number(fromWalletId),
                toCurrency: toCurrency,
                amount: parseFloat(amount)
            });
            Alert.alert("Sucesso", "Trade realizado!");
            onSuccess(); onClose(); setAmount(''); setFromWalletId(null);
        } catch (error) { 
            // Tratamento de erro detalhado do backend se disponível
            const msg = error.response?.data?.error || "Falha no trade.";
            Alert.alert("Erro", msg); 
        } finally { setLoading(false); }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Trade Rápido</Text>
                        <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#848E9C" /></TouchableOpacity>
                    </View>
                    
                    <Text style={styles.label}>De (Carteira)</Text>
                    <ScrollView style={styles.listScroll} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.optionsRow}>
                            {wallets.map(w => (
                                <TouchableOpacity key={w.id} style={[styles.optionChip, fromWalletId === w.id && styles.optionChipYellow]} onPress={() => setFromWalletId(w.id)}>
                                    <Text style={[styles.optionText, fromWalletId === w.id && {color:'#1E2329'}]}>{w.name} ({w.currency})</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text style={styles.label}>Para (Moeda)</Text>
                    <ScrollView style={styles.listScroll} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.optionsRow}>
                            {currencies.map(c => (
                                <TouchableOpacity key={c.id} style={[styles.optionChip, toCurrency === c.symbol && styles.optionChipYellow]} onPress={() => setToCurrency(c.symbol)}>
                                    <Text style={[styles.optionText, toCurrency === c.symbol && {color:'#1E2329'}]}>{c.symbol}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text style={styles.label}>Valor a Converter</Text>
                    <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#666" />
                    
                    <TouchableOpacity onPress={handleSubmit} style={[styles.confirmBtn, {backgroundColor: '#FCD535'}]} disabled={loading}>
                        {loading ? <ActivityIndicator color="#1E2329"/> : <Text style={[styles.btnText, {color:'#1E2329'}]}>Executar Trade</Text>}
                    </TouchableOpacity>
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
  
  // Controle de qual modal está aberto: 'create', 'deposit', 'trade', ou null
  const [activeModal, setActiveModal] = useState(null); 

  const fetchWallets = async () => {
    if (!refreshing) setLoading(true);
    try {
      const user = await userService.getProfile();
      setUserId(user.id);
      const data = await walletService.getUserWallets(user.id);
      setWallets(data);
    } catch (e) {
      console.error(e);
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

  const renderWalletItem = ({ item, index }) => (
    <MotiView 
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 100 }}
    >
        <TouchableOpacity 
            style={styles.walletCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate("WalletDetails", { walletId: item.id })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.symbolIcon}>
                    <Text style={styles.symbolIconText}>
                        {item.currency ? item.currency.substring(0, 2) : "$"}
                    </Text>
                </View>
                <View style={styles.symbolTag}>
                    <Text style={styles.symbolTagText}>{item.currency}</Text>
                </View>
            </View>

            <Text style={styles.walletName} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>
                    {item.balance ? item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "0,00"}
                </Text>
                <Text style={styles.balanceSymbol}>{item.currencyl}</Text>
            </View>
            
            <View style={styles.glow} />
        </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" />

      <View style={styles.content}>
        
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
                onPress={() => setActiveModal('create')}
            >
                <Feather name="plus" size={20} color="#fff" />
                <Text style={styles.createBtnText}>Nova</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => setActiveModal('deposit')}
            >
                <Feather name="download" size={20} color="#0ECB81" />
                <Text style={[styles.actionText, {color: '#0ECB81'}]}>Depositar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => setActiveModal('trade')}
            >
                <Feather name="repeat" size={20} color="#FCD535" />
                <Text style={[styles.actionText, {color: '#FCD535'}]}>Trade</Text>
            </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
            <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
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
                    </View>
                }
            />
        )}
      </View>

      {/* --- RENDERIZAÇÃO DOS MODAIS --- */}
      
      {/* Modal Criar */}
      <CreateWalletModal 
        visible={activeModal === 'create'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={fetchWallets}
        userId={userId}
      />

      {/* Modal Depositar */}
      <DepositModal 
        visible={activeModal === 'deposit'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={fetchWallets}
        userId={userId}
        wallets={wallets}
      />

      {/* Modal Trade */}
      <TradeModal 
        visible={activeModal === 'trade'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={fetchWallets}
        userId={userId}
        wallets={wallets}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  content: { flex: 1, paddingHorizontal: 20 },
  
  pageHeader: { marginTop: 20, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#EAECEF' },
  pageSubtitle: { fontSize: 14, color: '#848E9C' },

  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionBtn: { 
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, 
      paddingVertical: 12, borderRadius: 12, backgroundColor: '#1E2329', borderWidth: 1, borderColor: '#2B3139' 
  },
  createBtn: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  actionText: { fontWeight: 'bold', fontSize: 14 },

  listContent: { paddingBottom: 40 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  
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
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { color: '#848E9C', fontSize: 16 },

  // MODAL GERAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E2329', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#2B3139', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  
  label: { color: '#848E9C', marginBottom: 8, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { 
      backgroundColor: '#0B0E11', color: '#fff', padding: 14, borderRadius: 12, 
      borderWidth: 1, borderColor: '#2B3139', marginBottom: 20, fontSize: 16 
  },
  
  // Lista Horizontal dentro do Modal
  listScroll: { marginBottom: 20 },
  optionsRow: { flexDirection: 'row', gap: 10 },
  optionChip: { 
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, 
      borderWidth: 1, borderColor: '#2B3139', backgroundColor: '#0B0E11', marginRight: 10
  },
  optionChipSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  optionChipGreen: { backgroundColor: '#0ECB81', borderColor: '#0ECB81' }, // Para depósito
  optionChipYellow: { backgroundColor: '#FCD535', borderColor: '#FCD535' }, // Para trade
  
  optionText: { color: '#848E9C', fontSize: 14, fontWeight: 'bold' },

  modalButtons: { marginTop: 10 },
  confirmBtn: { padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#8B5CF6', marginBottom: 12 },
  cancelBtn: { padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#2B3139' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});