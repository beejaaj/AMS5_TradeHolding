"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Wallet } from "lucide-react";
import { currencyAPI } from "@/services/API";
import walletService from "@/services/walletService";
import userService from "@/services/userService";
import { Currency } from "@/services/types";

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; }

export const CreateWalletModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const [name, setName] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCurrencies = async () => {
                try {
                    const res = await fetch(currencyAPI.getAllCurrency());
                    if (res.ok) setCurrencies(await res.json());
                } catch(e) { console.error(e); }
            };
            fetchCurrencies();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await userService.getProfile();
            await walletService.createWallet({
                userId: Number(user.id),
                name,
                currency: selectedCurrency
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Erro ao criar carteira.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-5 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                    <h3 className="text-xl font-bold text-[#EAECEF] flex items-center gap-2"><Wallet className="text-[#8B5CF6]" /> Nova Carteira</h3>
                    <button onClick={onClose} className="text-[#848E9C] hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Nome da Carteira</label>
                        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none" placeholder="Ex: Poupança BTC" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Moeda</label>
                        <select required value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none">
                            <option value="">Selecione...</option>
                            {currencies.map((c) => (
                                <option key={c.id} value={c.symbol}>
                                    {c.symbol} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Criar</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};