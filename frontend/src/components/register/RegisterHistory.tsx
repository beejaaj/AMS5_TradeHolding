"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { currencyAPI, historyAPI } from "@/services/API";
import { Currency } from "@/services/types";
import { motion } from "framer-motion";
import { 
  TrendingUp, Calendar, DollarSign, Save, ArrowLeft, Loader2 
} from "lucide-react";
import Link from "next/link";

export const RegisterHistory = () => {
    const router = useRouter();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currencyId: "",
        value: "",
        date: new Date().toISOString().slice(0, 16) // Data atual formatada para input datetime-local
    });

    useEffect(() => {
        fetchCurrencies();
    }, []);

    async function fetchCurrencies() {
        try {
            const res = await fetch(currencyAPI.getAllCurrency());
            if (res.ok) setCurrencies(await res.json());
        } catch (error) { console.error(error); }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                currencyId: formData.currencyId,
                value: parseFloat(formData.value),
                date: new Date(formData.date).toISOString()
            };

            const res = await fetch(historyAPI.RegisterHistory(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/currency");
            } else {
                alert("Erro ao registrar histórico.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-lg"
            >
                <div className="p-6 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                            <TrendingUp className="text-[#8B5CF6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#EAECEF]">Novo Registro</h2>
                            <p className="text-sm text-[#848E9C]">Adicionar preço histórico manualmente.</p>
                        </div>
                    </div>
                    <Link href="/currency">
                        <button className="text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139] p-2 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#848E9C] uppercase">Selecione o Ativo</label>
                        <select
                            required
                            value={formData.currencyId}
                            onChange={(e) => setFormData({...formData, currencyId: e.target.value})}
                            className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6]"
                        >
                            <option value="">Selecione...</option>
                            {currencies.map(c => (
                                <option key={c.id} value={c.id}>{c.symbol} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#848E9C] uppercase">Preço (Valor)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                            <input
                                required
                                type="number"
                                step="0.00000001"
                                value={formData.value}
                                onChange={(e) => setFormData({...formData, value: e.target.value})}
                                placeholder="0.00"
                                className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#848E9C] uppercase">Data e Hora</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                            <input
                                required
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6] [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/20 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Registrar Preço</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};