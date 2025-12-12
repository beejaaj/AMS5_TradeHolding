import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { historyAPI } from "../services/API";

const ITEMS_PER_PAGE = 5;

export default function CurrencyHistory({ currencyId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currencyId) fetchHistory();
  }, [currencyId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(historyAPI.GetByCurrency(currencyId));
      if (res.ok) {
        const data = await res.json();
        setHistory(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getVariation = (currentIndex, allItems) => {
    const previousItem = allItems[currentIndex + 1];
    if (!previousItem) return { type: 'neutral', diff: 0 };
    const currentVal = allItems[currentIndex].value;
    const prevVal = previousItem.value;
    
    if (currentVal > prevVal) return { type: 'up' };
    if (currentVal < prevVal) return { type: 'down' };
    return { type: 'neutral' };
  };

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Preços</Text>
        <View style={styles.countBadge}>
            <Text style={styles.countText}>{history.length}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.th, {flex: 1}]}>Data</Text>
        <Text style={[styles.th, {flex: 1, textAlign: 'right'}]}>Preço (R$)</Text>
        <Text style={[styles.th, {width: 60, textAlign: 'right'}]}>Var</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#8B5CF6" style={{padding: 20}} />
      ) : currentItems.length === 0 ? (
        <Text style={styles.emptyText}>Sem histórico.</Text>
      ) : (
        currentItems.map((h, i) => {
            const realIndex = startIndex + i;
            const variation = getVariation(realIndex, history);
            return (
                <View key={i} style={styles.row}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6}}>
                        <Feather name="calendar" size={12} color="#848E9C" />
                        <Text style={styles.dateText}>{format(new Date(h.date), "dd/MM HH:mm", {locale: ptBR})}</Text>
                    </View>
                    <Text style={styles.priceText}>R$ {h.value.toFixed(2)}</Text>
                    <View style={{width: 60, alignItems: 'flex-end'}}>
                        {variation.type === 'up' && <Feather name="trending-up" size={16} color="#0ECB81" />}
                        {variation.type === 'down' && <Feather name="trending-down" size={16} color="#F6465D" />}
                        {variation.type === 'neutral' && <Feather name="minus" size={16} color="#848E9C" />}
                    </View>
                </View>
            );
        })
      )}

      {totalPages > 1 && (
        <View style={styles.footer}>
            <Text style={styles.pageInfo}>Pág {currentPage} de {totalPages}</Text>
            <View style={{flexDirection: 'row', gap: 8}}>
                <TouchableOpacity 
                    disabled={currentPage === 1} 
                    onPress={() => setCurrentPage(p => p - 1)}
                    style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                >
                    <Feather name="chevron-left" size={18} color="#EAECEF" />
                </TouchableOpacity>
                <TouchableOpacity 
                    disabled={currentPage === totalPages} 
                    onPress={() => setCurrentPage(p => p + 1)}
                    style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                >
                    <Feather name="chevron-right" size={18} color="#EAECEF" />
                </TouchableOpacity>
            </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E2329', borderRadius: 16, borderWidth: 1, borderColor: '#2B3139', overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2B3139', alignItems: 'center' },
  title: { color: '#EAECEF', fontSize: 16, fontWeight: 'bold' },
  countBadge: { backgroundColor: '#2B3139', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  countText: { color: '#848E9C', fontSize: 12, fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', padding: 12, backgroundColor: '#0B0E11', borderBottomWidth: 1, borderBottomColor: '#2B3139' },
  th: { color: '#848E9C', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  row: { flexDirection: 'row', padding: 14, borderBottomWidth: 1, borderBottomColor: '#2B3139', alignItems: 'center' },
  dateText: { color: '#848E9C', fontSize: 13 },
  priceText: { flex: 1, textAlign: 'right', color: '#EAECEF', fontSize: 13, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  emptyText: { color: '#848E9C', textAlign: 'center', padding: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#0B0E11' },
  pageInfo: { color: '#848E9C', fontSize: 12 },
  pageBtn: { padding: 6, backgroundColor: '#2B3139', borderRadius: 6 },
  pageBtnDisabled: { opacity: 0.3 }
});