"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import NavBar from "@/components/NavBar";

const initialData = [
  { name: "00:00", btc: 42000 },
  { name: "04:00", btc: 42500 },
  { name: "08:00", btc: 41800 },
  { name: "12:00", btc: 43200 },
  { name: "16:00", btc: 44000 },
  { name: "20:00", btc: 43800 },
];

export default function Home() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) => {
        const lastValue = currentData[currentData.length - 1].btc;
        const newValue = lastValue + (Math.random() - 0.5) * 500; 
        const newEntry = { 
            name: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' }), 
            btc: newValue 
        };
        return [...currentData.slice(1), newEntry]; 
      });
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-textPrimary pt-20">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Visão Geral do Mercado</h1>
          <p className="text-textSecondary">Acompanhe seus ativos em tempo real.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Saldo Total", value: "R$ 142.350,00", change: "+2.5%", color: "text-success" },
            { label: "Lucro 24h", value: "R$ 3.240,00", change: "+1.2%", color: "text-success" },
            { label: "Ativos em Baixa", value: "Ethereum", change: "-0.8%", color: "text-danger" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-textSecondary text-sm">{stat.label}</h3>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className={`text-sm ${stat.color} mb-1`}>{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="bg-surface p-6 rounded-2xl border border-white/5 h-[400px]"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Bitcoin (BTC/BRL)</h2>
            <div className="flex gap-2">
                <button className="px-3 py-1 bg-surfaceHover rounded text-xs text-white">1H</button>
                <button className="px-3 py-1 bg-primary text-white rounded text-xs">24H</button>
                <button className="px-3 py-1 bg-surfaceHover rounded text-xs text-white">1W</button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
              <XAxis dataKey="name" stroke="#848E9C" tick={{fontSize: 12}} />
              <YAxis stroke="#848E9C" domain={['auto', 'auto']} tick={{fontSize: 12}} 
                     tickFormatter={(value) => `R$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181A20', borderColor: '#2B3139', color: '#fff' }}
                itemStyle={{ color: '#8B5CF6' }}
              />
              <Area 
                type="monotone" 
                dataKey="btc" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBtc)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
}