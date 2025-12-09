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
        if (currencyId) {
            setData([]); 
            setStats({ current: 0, change: 0 });
            fetchChartData();
        }
    }, [currencyId, timeFrame]);

    async function fetchChartData() {
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
                const historyData: History[] = await res.json();
                
                const formatted = historyData
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(h => ({
                        time: new Date(h.date).getTime(),
                        displayTime: format(new Date(h.date), timeFrame === '1H' || timeFrame === '1D' ? 'HH:mm' : 'dd/MM'),
                        price: h.value
                    }));

                setData(formatted);

                if (formatted.length > 0) {
                    const first = formatted[0].price;
                    const last = formatted[formatted.length - 1].price;
                    const change = first !== 0 ? ((last - first) / first) * 100 : 0;
                    setStats({ current: last, change });
                }
            }
        } catch (err) {
            console.error("Erro chart", err);
        } finally {
            setLoading(false);
        }
    }

    const isPositive = stats.change >= 0;

    return (
        <div className="bg-[#1E2329] rounded-2xl border border-[#2B3139] p-4 sm:p-6 shadow-xl h-[350px] sm:h-[450px] flex flex-col transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                <div>
                    <h3 className="text-[#848E9C] text-xs font-bold uppercase tracking-wider">Preço de Mercado ({symbol})</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        {loading && data.length === 0 ? (
                            <span className="text-2xl sm:text-3xl font-bold text-[#848E9C] animate-pulse">---</span>
                        ) : (
                            <span className="text-2xl sm:text-3xl font-bold text-[#EAECEF]">
                                {stats.current > 0 ? `R$ ${stats.current.toFixed(2)}` : "R$ 0.00"}
                            </span>
                        )}
                        
                        {!loading && stats.current > 0 && (
                            <div className={`flex items-center text-xs sm:text-sm font-medium px-1.5 py-0.5 rounded ${isPositive ? 'bg-[#0ECB81]/10 text-[#0ECB81]' : 'bg-[#F6465D]/10 text-[#F6465D]'}`}>
                                {isPositive ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                                {stats.change.toFixed(2)}%
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex bg-[#0B0E11] rounded-lg p-1 border border-[#2B3139] w-full sm:w-auto overflow-x-auto">
                    {(['1H', '1D', '1W', '1M', '1Y'] as TimeFrame[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeFrame(tf)}
                            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded transition-all whitespace-nowrap ${
                                timeFrame === tf ? 'bg-[#2B3139] text-white shadow' : 'text-[#848E9C] hover:text-white'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E2329]/80 z-10 rounded">
                        <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
                    </div>
                )}
                
                {!loading && data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-[#848E9C] text-sm bg-[#0B0E11]/30 rounded-lg border border-[#2B3139] border-dashed">
                        Sem dados históricos para este período.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                {/* GRADIENTE ROXO (Cor Original) */}
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
                            <XAxis dataKey="displayTime" hide />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                orientation="right" 
                                tick={{fill: '#848E9C', fontSize: 10}} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(val) => `R$${val}`}
                                width={55}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1E2329', borderColor: '#2B3139', color: '#fff', borderRadius: '8px', fontSize: '12px' }} 
                                itemStyle={{ color: '#8B5CF6' }} // Tooltip Roxo
                            />
                            {/* LINHA ROXA */}
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#8B5CF6" 
                                strokeWidth={2} 
                                fill="url(#colorPrice)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};