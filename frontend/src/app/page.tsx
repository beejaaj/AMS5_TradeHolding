"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Activity, Coins, ArrowRight, Wallet, Globe, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { currencyAPI, historyAPI } from "@/services/API";
import { Currency, History } from "@/services/types";
import { format, subDays } from "date-fns";

export default function Home() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [highlightCoin, setHighlightCoin] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados reais do backend
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Busca todas as moedas
        const resCurrency = await fetch(currencyAPI.getAllCurrency());
        if (resCurrency.ok) {
          const data: Currency[] = await resCurrency.json();
          setCurrencies(data);

          // 2. Define a moeda de destaque (a primeira da lista ou BTC se existir)
          const featured = data.find(c => c.symbol === "BTC") || data[0];
          setHighlightCoin(featured);

          // 3. Se tiver moeda destaque, busca o histórico dela para o gráfico
          if (featured && featured.id) {
            const now = new Date();
            const from = subDays(now, 7); // Últimos 7 dias
            
            const resHistory = await fetch(
              `${historyAPI.GetRange(featured.id)}?from=${from.toISOString()}&to=${now.toISOString()}`
            );
            
            if (resHistory.ok) {
              const historyData: History[] = await resHistory.json();
              // Formata para o gráfico
              const formatted = historyData
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(h => ({
                  date: format(new Date(h.date), "dd/MM"),
                  price: h.value
                }));
              setChartData(formatted);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Variação do Destaque (Simples cálculo se houver dados)
  const lastPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const startPrice = chartData.length > 0 ? chartData[0].price : 0;
  const variation = startPrice > 0 ? ((lastPrice - startPrice) / startPrice) * 100 : 0;
  const isPositive = variation >= 0;

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">
      <NavBar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION - Apresentação Lunaria */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              Plataforma Live
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              O futuro do trade é <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]">
                Lunaria
              </span>
            </h1>
            
            <p className="text-[#848E9C] text-lg sm:text-xl max-w-md leading-relaxed">
              Explore o mercado de criptoativos com dados em tempo real, segurança avançada e uma interface projetada para você.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/currency">
                <button className="px-8 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B5CF6]/20 flex items-center gap-2">
                  Começar Agora <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/users/create">
                <button className="px-8 py-3.5 bg-[#2B3139] hover:bg-[#474D57] text-[#EAECEF] rounded-xl font-bold transition-all border border-[#474D57]">
                  Criar Conta
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Gráfico de Destaque (Visual) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl -z-10" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[#848E9C] text-sm font-bold uppercase">Ativo em Destaque</p>
                  <h3 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                    {highlightCoin ? highlightCoin.name : "Carregando..."}
                    <span className="text-xs bg-[#2B3139] px-2 py-0.5 rounded text-[#848E9C]">
                      {highlightCoin?.symbol}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[#EAECEF] text-xl font-mono font-bold">
                    {lastPrice > 0 ? `R$ ${lastPrice.toFixed(2)}` : "---"}
                  </p>
                  <p className={`text-sm font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <Activity size={14} />}
                    {Math.abs(variation).toFixed(2)}% (7d)
                  </p>
                </div>
              </div>

              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1E2329', borderColor: '#2B3139', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#8B5CF6' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8B5CF6" 
                        strokeWidth={3} 
                        fill="url(#colorHome)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-[#848E9C] text-sm">
                    {loading ? "Carregando dados de mercado..." : "Gráfico indisponível no momento."}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ESTATÍSTICAS DE MERCADO (DADOS REAIS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1E2329] p-6 rounded-2xl border border-[#2B3139] hover:border-[#8B5CF6]/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-[#0B0E11] rounded-xl flex items-center justify-center mb-4 text-[#8B5CF6] group-hover:scale-110 transition-transform">
              <Coins size={24} />
            </div>
            <h3 className="text-[#848E9C] text-sm font-bold uppercase">Ativos Listados</h3>
            <p className="text-3xl font-bold text-white mt-1">{currencies.length}</p>
            <p className="text-xs text-[#848E9C] mt-2">Moedas disponíveis para trade</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#1E2329] p-6 rounded-2xl border border-[#2B3139] hover:border-[#8B5CF6]/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-[#0B0E11] rounded-xl flex items-center justify-center mb-4 text-[#0ECB81] group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-[#848E9C] text-sm font-bold uppercase">Conexão Global</h3>
            <p className="text-3xl font-bold text-white mt-1">24/7</p>
            <p className="text-xs text-[#848E9C] mt-2">Mercado sempre ativo</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#1E2329] p-6 rounded-2xl border border-[#2B3139] hover:border-[#8B5CF6]/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-[#0B0E11] rounded-xl flex items-center justify-center mb-4 text-[#FCD535] group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-[#848E9C] text-sm font-bold uppercase">Segurança</h3>
            <p className="text-3xl font-bold text-white mt-1">100%</p>
            <p className="text-xs text-[#848E9C] mt-2">Dados criptografados</p>
          </motion.div>
        </div>

        {/* LISTA RÁPIDA (TOP 5) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1E2329] rounded-2xl border border-[#2B3139] overflow-hidden"
        >
          <div className="p-6 border-b border-[#2B3139] flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Mercado Agora</h2>
            <Link href="/currency" className="text-[#8B5CF6] text-sm font-bold hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B0E11] text-[#848E9C] text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Ativo</th>
                  <th className="px-6 py-4">Símbolo</th>
                  <th className="px-6 py-4">Lastro</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B3139]">
                {currencies.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-[#2B3139]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2B3139] flex items-center justify-center text-[#8B5CF6] text-xs font-bold border border-[#474D57]">
                        {c.symbol.substring(0, 2)}
                      </div>
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-[#848E9C] font-mono">{c.symbol}</td>
                    <td className="px-6 py-4 text-[#EAECEF]">
                      <span className="bg-[#2B3139] px-2 py-1 rounded text-xs border border-[#474D57]">{c.backing}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/currency`}>
                        <button className="text-[#8B5CF6] hover:text-[#7C3AED] font-bold text-sm">
                          Negociar
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {currencies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[#848E9C]">
                      Nenhuma moeda disponível no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}