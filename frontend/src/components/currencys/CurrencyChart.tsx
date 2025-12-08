"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { historyAPI } from "@/services/API";
import { History } from "@/services/types";
import { format, subHours, subDays, subMonths, subYears } from "date-fns";

type TimeFrame = '1H' | '1D' | '1W' | '1M' | '1Y';

export const CurrencyChart = ({ currencyId, symbol }: { currencyId: string, symbol: string }) => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('1D');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ current: 0, change: 0 });

    useEffect(() => {
        if (currencyId) fetchChartData();
    }, [currencyId, timeFrame]);

    async function fetchChartData() {
        setLoading(true);
        try {
            const now = new Date();
            let from = new Date();

            // Lógica de Filtro de Tempo
            switch (timeFrame) {
                case '1H': from = subHours(now, 1); break;
                case '1D': from = subDays(now, 1); break;
                case '1W': from = subDays(now, 7); break;
                case '1M': from = subMonths(now, 1); break;
                case '1Y': from = subYears(now, 1); break;
            }

            // Chamada ao Gateway Ocelot
            const url = `${historyAPI.GetRange(currencyId)}?from=${from.toISOString()}&to=${now.toISOString()}`;
            const res = await fetch(url);
            
            if (res.ok) {
                const historyData: History[] = await res.json();
                
                // Formatação para o Recharts
                const formatted = historyData
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(h => ({
                        time: new Date(h.date).getTime(),
                        displayTime: format(new Date(h.date), timeFrame === '1H' || timeFrame === '1D' ? 'HH:mm' : 'dd/MM'),
                        price: h.value
                    }));

                setData(formatted);

                // Calcular variação simples
                if (formatted.length > 0) {
                    const first = formatted[0].price;
                    const last = formatted[formatted.length - 1].price;
                    const change = ((last - first) / first) * 100;
                    setStats({ current: last, change });
                }
            }
        } catch (err) {
            console.error("Erro ao carregar gráfico", err);
        } finally {
            setLoading(false);
        }
    }

    const isPositive = stats.change >= 0;

    return (
        <div className="bg-[#1E2329] rounded-2xl border border-[#2B3139] p-6 shadow-xl h-[450px] flex flex-col">
            {/* Header do Gráfico */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-[#848E9C] text-xs font-bold uppercase mb-1">Preço de Mercado</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-[#EAECEF]">
                            {loading && data.length === 0 ? "..." : `R$ ${stats.current.toFixed(2)}`}
                        </span>
                        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {stats.change.toFixed(2)}%
                        </div>
                    </div>
                </div>
                
                {/* Botões de Filtro */}
                <div className="flex bg-[#0B0E11] rounded-lg p-1 border border-[#2B3139]">
                    {(['1H', '1D', '1W', '1M', '1Y'] as TimeFrame[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeFrame(tf)}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                                timeFrame === tf 
                                ? 'bg-[#2B3139] text-[#EAECEF] shadow-sm' 
                                : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139]/50'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Área do Gráfico */}
            <div className="flex-1 w-full min-h-0 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E2329]/80 z-10 rounded-lg">
                        <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
                    </div>
                )}
                
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
                            <XAxis 
                                dataKey="displayTime" 
                                stroke="#848E9C" 
                                tick={{fontSize: 11}} 
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                orientation="right" 
                                tick={{fill: '#848E9C', fontSize: 11}}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `R$${val}`}
                                width={60}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1E2329', borderColor: '#2B3139', color: '#EAECEF', borderRadius: '8px' }}
                                itemStyle={{ color: '#8B5CF6' }}
                                labelStyle={{ color: '#848E9C', marginBottom: '0.25rem' }}
                                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#8B5CF6" 
                                strokeWidth={2} 
                                fillOpacity={1} 
                                fill="url(#colorPrice)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-[#848E9C] text-sm">
                        Sem dados para o período selecionado.
                    </div>
                )}
            </div>
        </div>
    );
};