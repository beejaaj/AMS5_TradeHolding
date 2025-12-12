"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowDownCircle, Loader2 } from "lucide-react";
import walletService from "@/services/walletService";
import userService from "@/services/userService"; // <--- 1. IMPORTAR USER SERVICE
import { Wallet } from "@/services/types";

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; wallets: Wallet[]; }

export const DepositModal = ({ isOpen, onClose, onSuccess, wallets }: Props) => {
    const [walletId, setWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // <--- 2. BUSCAR O USUÁRIO LOGADO
            const user = await userService.getProfile();
            
            if (!user.id) {
                alert("Erro: ID do usuário não encontrado.");
                return;
            }

            // <--- 3. ENVIAR O USERID JUNTO
            await walletService.deposit({ 
                userId: Number(user.id), 
                walletId: Number(walletId), 
                amount: parseFloat(amount) 
            });
            
            onSuccess();
            onClose();
        } catch (error) { // Adicione 'error' para logar se quiser
            console.error(error);
            alert("Erro no depósito."); 
        } finally { 
            setLoading(false); 
        }
    };

    if (!isOpen) return null;

    // ... o restante do return (JSX) permanece igual
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-5 border-b border-[#2B3139] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#EAECEF] flex items-center gap-2"><ArrowDownCircle className="text-[#0ECB81]" /> Depositar</h3>
                    <button onClick={onClose} className="text-[#848E9C] hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Carteira de Destino</label>
                        <select required value={walletId} onChange={(e) => setWalletId(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#0ECB81] outline-none">
                            <option value="">Selecione...</option>
                            {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currencySymbol})</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Valor</label>
                        <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#0ECB81] outline-none" placeholder="0.00" step="0.01" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#0ECB81] hover:bg-[#09B06D] text-white font-bold py-3 rounded-xl transition-all flex justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : "Confirmar Depósito"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};