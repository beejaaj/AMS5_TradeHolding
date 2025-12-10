"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowRightLeft, Loader2 } from "lucide-react";
import walletService from "@/services/walletService";
import { currencyAPI } from "@/services/API";
import { Wallet, Currency } from "@/services/types";
import userService from "@/services/userService";

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; wallets: Wallet[]; }

export const TradeModal = ({ isOpen, onClose, onSuccess, wallets }: Props) => {
    const [fromWalletId, setFromWalletId] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const load = async () => {
                const res = await fetch(currencyAPI.getAllCurrency());
                if (res.ok) setCurrencies(await res.json());
            };
            load();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await userService.getProfile();
            await walletService.trade({
                userId: Number(user.id),
                fromWalletId: Number(fromWalletId),
                toCurrency,
                amount: parseFloat(amount)
            });
            onSuccess();
            onClose();
        } catch { alert("Erro no trade."); } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-5 border-b border-[#2B3139] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#EAECEF] flex items-center gap-2"><ArrowRightLeft className="text-[#FCD535]" /> Trade Rápido</h3>
                    <button onClick={onClose} className="text-[#848E9C] hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">De (Carteira)</label>
                        <select required value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#FCD535] outline-none">
                            <option value="">Selecione...</option>
                            {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currencySymbol}) - Saldo: {w.balance}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Para (Moeda)</label>
                        <select required value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#FCD535] outline-none">
                            <option value="">Selecione...</option>
                            {currencies.map(c => <option key={c.id} value={c.symbol}>{c.symbol} - {c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Valor a Converter</label>
                        <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#FCD535] outline-none" placeholder="0.00" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#FCD535] hover:bg-[#F0B90B] text-[#1E2329] font-bold py-3 rounded-xl transition-all flex justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : "Executar Trade"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};