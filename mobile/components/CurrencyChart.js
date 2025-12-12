import React, { useState, useEffect } from "react";
import { 
  StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions 
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Feather } from "@expo/vector-icons";
import { format, subHours, subDays, subMonths, subYears } from "date-fns";
import { historyAPI } from "../services/API";

const { width } = Dimensions.get("window");

export default function CurrencyChart({ currencyId, symbol }) {
  const [timeFrame, setTimeFrame] = useState('1D');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ current: 0, change: 0 });

  useEffect(() => {
    if (currencyId) fetchChartData();
  }, [currencyId, timeFrame]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let from = new Date();

      switch (timeFrame) {
        case '1H': from = subHours(now, 1); break;
        case '1D': from = subDays(now, 1); break;
        case '1W': from = subDays(now, 7); break;
        case '1M': from = subMonths(now, 1); break;
        case '1Y': from = subYears(now, 1); break;
      }

      const url = `${historyAPI.GetRange(currencyId)}?from=${from.toISOString()}&to=${now.toISOString()}`;
      const res = await fetch(url);
      
      if (res.ok) {
        const historyData = await res.json();
        const sorted = historyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (sorted.length > 0) {
            const first = sorted[0].value;
            const last = sorted[sorted.length - 1].value;
            const change = first !== 0 ? ((last - first) / first) * 100 : 0;
            setStats({ current: last, change });

            const labels = sorted.map((h, i) => {
                if (i % Math.ceil(sorted.length / 5) === 0) {
                    return format(new Date(h.date), timeFrame === '1H' || timeFrame === '1D' ? 'HH:mm' : 'dd/MM');
                }
                return "";
            });

            setChartData({
                labels: labels,
                datasets: [{ data: sorted.map(h => h.value) }]
            });
        } else {
            setChartData(null);
        }
      }
    } catch (err) {
      console.error("Erro chart", err);
    } finally {
      setLoading(false);
    }
  };

  const isPositive = stats.change >= 0;

  const chartConfig = {
    backgroundGradientFrom: "#1E2329",
    backgroundGradientTo: "#1E2329",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(132, 142, 156, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "0" },
    propsForBackgroundLines: { strokeDasharray: "" }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
            <Text style={styles.label}>Preço de Mercado ({symbol})</Text>
            <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                    {loading && !chartData ? "---" : `R$ ${stats.current.toFixed(2)}`}
                </Text>
                {!loading && chartData && (
                    <View style={[styles.badge, isPositive ? styles.badgeGreen : styles.badgeRed]}>
                        <Feather name={isPositive ? "trending-up" : "trending-down"} size={14} color={isPositive ? "#0ECB81" : "#F6465D"} />
                        <Text style={[styles.badgeText, isPositive ? {color: "#0ECB81"} : {color: "#F6465D"}]}>
                            {stats.change.toFixed(2)}%
                        </Text>
                    </View>
                )}
            </View>
        </View>
        
        <View style={styles.filterContainer}>
            {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                <TouchableOpacity
                    key={tf}
                    onPress={() => setTimeFrame(tf)}
                    style={[styles.filterButton, timeFrame === tf && styles.filterButtonActive]}
                >
                    <Text style={[styles.filterText, timeFrame === tf && styles.filterTextActive]}>{tf}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={styles.chartWrapper}>
        {loading ? (
            <ActivityIndicator color="#8B5CF6" size="large" />
        ) : chartData ? (
            <LineChart
                data={chartData}
                width={width - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: 16, paddingRight: 40 }}
                withInnerLines={false}
                yAxisLabel="R$"
                yAxisInterval={100}
            />
        ) : (
            <Text style={styles.emptyText}>Sem dados para este período.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E2329', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2B3139', marginBottom: 20 },
  header: { marginBottom: 16 },
  label: { color: '#848E9C', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  priceText: { color: '#EAECEF', fontSize: 24, fontWeight: 'bold' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 4 },
  badgeGreen: { backgroundColor: 'rgba(14, 203, 129, 0.1)' },
  badgeRed: { backgroundColor: 'rgba(246, 70, 93, 0.1)' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', backgroundColor: '#0B0E11', borderRadius: 8, padding: 2, justifyContent: 'space-between' },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, flex: 1, alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#2B3139' },
  filterText: { color: '#848E9C', fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: '#EAECEF' },
  chartWrapper: { height: 220, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#848E9C', fontStyle: 'italic' }
});