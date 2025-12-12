import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Clipboard,
  Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { MotiView } from "moti";
import * as ExpoClipboard from 'expo-clipboard'; 

import walletService from "../../services/walletService";
import userService from "../../services/userService";

const ITEMS_PER_PAGE = 5;

// --- MODAL DE TRANSFERÊNCIA ---
const TransferModal = ({ visible, onClose, onSuccess, walletId, currency }) => {
    const [toWalletId, setToWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!toWalletId || !amount) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            // Precisamos do ID do usuário logado para autorizar a transferência
            const user = await userService.getProfile();

            await walletService.transfer({
                userId: Number(user.id), // <--- ADICIONADO (Obrigatório no C#)
                fromWalletId: Number(walletId),
                toWalletId: Number(toWalletId), // <--- Agora enviamos ID numérico
                amount: parseFloat(amount)
            });
            
            Alert.alert("Sucesso", "Transferência realizada!");
            onSuccess();
            onClose();
            setToWalletId('');
            setAmount('');
        } catch (error) {
            console.error(error);
            const msg = error.message || "Falha na transferência.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

   return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Transferir {currency}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#848E9C" />
                        </TouchableOpacity>
                    </View>

                    {/* MUDANÇA: Label e Input agora são para ID da Carteira */}
                    <Text style={styles.label}>ID da Carteira de Destino</Text>
                    <TextInput 
                        style={styles.input} 
                        value={toWalletId} 
                        onChangeText={setToWalletId} 
                        placeholder="Ex: 15" 
                        placeholderTextColor="#666"
                        keyboardType="numeric" // Força teclado numérico
                    />

                    <Text style={styles.label}>Valor</Text>
                    <TextInput 
                        style={styles.input} 
                        value={amount} 
                        onChangeText={setAmount} 
                        placeholder="0.00" 
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                    />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.btnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.confirmBtn} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff"/> : <Text style={[styles.btnText, {fontWeight: 'bold'}]}>Enviar</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// --- TELA PRINCIPAL ---
export default function WalletDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { walletId } = route.params; // Recebe ID da navegação

  const [wallet, setWallet] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDetails = async () => {
    setLoading(true);
    try {
        const user = await userService.getProfile();
        // Chama API de detalhes (precisa existir no walletService)
        // Se não existir getWalletDetails no service mobile, adicione-o no walletService.ts:
        // getWalletDetails: (userId, walletId) => axios.get(...)
        const res = await walletService.getWalletDetails(user.id, walletId);
        
        setWallet(res.wallet || res.Wallet);
        const transactions = res.transactions || res.Transactions || [];
        setAllTransactions(transactions);
        
        // Paginação inicial
        updatePagination(1, transactions);
    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar a carteira.");
        navigation.goBack();
    } finally {
        setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        if(walletId) fetchDetails();
    }, [walletId])
  );

  const updatePagination = (page, transactions = allTransactions) => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedTransactions(transactions.slice(startIndex, endIndex));
      setCurrentPage(page);
  };

  const copyToClipboard = async (text) => {
      await ExpoClipboard.setStringAsync(text); // Requer 'expo-clipboard'
      // Ou use Clipboard do react-native se não tiver expo-clipboard
      Alert.alert("Copiado", "Código copiado para a área de transferência.");
  };

  if (loading && !wallet) {
      return (
          <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
              <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
      );
  }

  if (!wallet) return null;

  const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#848E9C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Carteira</Text>
        <View style={{width: 40}}/>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Principal */}
        <MotiView 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.mainCard}
        >
            <View style={styles.glow} />
            
            <View style={styles.walletHeader}>
                <View style={styles.iconBox}>
                    <FontAwesome5 name="wallet" size={24} color="#8B5CF6" />
                </View>
                <View>
                    <Text style={styles.walletName}>{wallet.name}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(String(wallet.id))} style={styles.idCopy}>
                        <Text style={styles.idLabel}>ID:</Text>
                        <Text style={styles.idValue}>{wallet.id}</Text>
                        <Feather name="copy" size={12} color="#848E9C" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>SALDO DISPONÍVEL</Text>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>
                        {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </Text>
                    <Text style={styles.balanceSymbol}>{wallet.currencySymbol}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.transferBtn} onPress={() => setShowTransfer(true)}>
                <Feather name="send" size={18} color="#fff" />
                <Text style={styles.btnText}>Transferir</Text>
            </TouchableOpacity>
        </MotiView>

        {/* Histórico */}
        <Text style={styles.sectionTitle}>Histórico de Transações</Text>
        
        <View style={styles.historyList}>
            {displayedTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Feather name="refresh-cw" size={32} color="#2B3139" />
                    <Text style={styles.emptyText}>Nenhuma transação.</Text>
                </View>
            ) : (
                displayedTransactions.map((t) => (
                    <View key={t.id} style={styles.transactionRow}>
                        <View style={styles.tIconBox}>
                            {t.amount >= 0 
                                ? <Feather name="arrow-down-circle" size={24} color="#0ECB81" />
                                : <Feather name="arrow-up-circle" size={24} color="#F6465D" />
                            }
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.tType}>{t.type ? t.type.replace(/_/g, ' ') : 'Transação'}</Text>
                            <Text style={styles.tDesc} numberOfLines={1}>{t.description}</Text>
                        </View>
                        <Text style={[styles.tAmount, {color: t.amount >= 0 ? '#0ECB81' : '#F6465D'}]}>
                            {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('pt-BR', { maximumFractionDigits: 8 })}
                        </Text>
                    </View>
                ))
            )}

            {/* Paginação */}
            {totalPages > 1 && (
                <View style={styles.pagination}>
                    <TouchableOpacity 
                        disabled={currentPage === 1} 
                        onPress={() => updatePagination(currentPage - 1)}
                        style={[styles.pageBtn, currentPage === 1 && {opacity: 0.3}]}
                    >
                        <Feather name="chevron-left" size={20} color="#EAECEF" />
                    </TouchableOpacity>
                    
                    <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>

                    <TouchableOpacity 
                        disabled={currentPage === totalPages} 
                        onPress={() => updatePagination(currentPage + 1)}
                        style={[styles.pageBtn, currentPage === totalPages && {opacity: 0.3}]}
                    >
                        <Feather name="chevron-right" size={20} color="#EAECEF" />
                    </TouchableOpacity>
                </View>
            )}
        </View>

      </ScrollView>

      <TransferModal 
        visible={showTransfer} 
        onClose={() => setShowTransfer(false)}
        onSuccess={fetchDetails}
        walletId={wallet.id}
        currency={wallet.currencySymbol}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E11" },
  
  headerBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#EAECEF' },
  backButton: { padding: 8, backgroundColor: '#1E2329', borderRadius: 12, borderWidth: 1, borderColor: '#2B3139' },

  content: { padding: 20, paddingBottom: 40 },

  // Main Card
  mainCard: {
      backgroundColor: '#1E2329', borderRadius: 24, padding: 24, marginBottom: 30,
      borderWidth: 1, borderColor: '#2B3139', overflow: 'hidden', position: 'relative'
  },
  glow: {
      position: 'absolute', top: -50, right: -50, width: 150, height: 150,
      backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 100, zIndex: -1
  },
  walletHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  iconBox: {
      width: 50, height: 50, borderRadius: 16, backgroundColor: '#0B0E11',
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2B3139'
  },
  walletName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  idCopy: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0B0E11', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4, alignSelf: 'flex-start' },
  idLabel: { color: '#848E9C', fontSize: 10, fontWeight: 'bold' },
  idValue: { color: '#8B5CF6', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' },

  balanceContainer: { marginBottom: 24 },
  balanceLabel: { color: '#848E9C', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  balanceValue: { color: '#EAECEF', fontSize: 32, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  balanceSymbol: { color: '#8B5CF6', fontSize: 18, fontWeight: 'bold' },

  transferBtn: {
      backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 12,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      shadowColor: "#8B5CF6", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // History
  sectionTitle: { color: '#EAECEF', fontSize: 18, fontWeight: 'bold', marginBottom: 12, paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  historyList: { backgroundColor: '#1E2329', borderRadius: 16, borderWidth: 1, borderColor: '#2B3139', overflow: 'hidden' },
  
  transactionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2B3139', gap: 12 },
  tIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0B0E11', alignItems: 'center', justifyContent: 'center' },
  tType: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  tDesc: { color: '#848E9C', fontSize: 12 },
  tAmount: { fontWeight: 'bold', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  emptyState: { padding: 40, alignItems: 'center', gap: 10 },
  emptyText: { color: '#848E9C' },

  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#0B0E11' },
  pageBtn: { padding: 8, backgroundColor: '#2B3139', borderRadius: 8 },
  pageText: { color: '#848E9C', fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E2329', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#2B3139' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  label: { color: '#848E9C', marginBottom: 8, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { 
      backgroundColor: '#0B0E11', color: '#fff', padding: 14, borderRadius: 12, 
      borderWidth: 1, borderColor: '#2B3139', marginBottom: 20, fontSize: 16 
  },
  confirmBtn: { padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#8B5CF6' },
});