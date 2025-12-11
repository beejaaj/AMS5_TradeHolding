"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import walletService from "@/services/walletService";
import userService from "@/services/userService";

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; walletId: number; currency: string; }

export const TransferModal = ({ isOpen, onClose, onSuccess, walletId, currency }: Props) => {
    const [toWalletId, setToWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Validação de segurança para números negativos
        const val = parseFloat(amount);
        if (!val || val <= 0) {
            alert("O valor da transferência deve ser maior que zero.");
            setLoading(false);
            return;
        }

        try {
            const user = await userService.getProfile();
            await walletService.transfer({
                userId: Number(user.id),
                fromWalletId: walletId,
                toWalletId: Number(toWalletId),
                amount: val
            });
            alert("Transferência realizada com sucesso!");
            onSuccess();
            onClose();
            // Limpar campos
            setAmount("");
            setToWalletId("");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Erro ao realizar transferência.";
            alert(msg);
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    {/* Ícone e Texto em ROXO */}
                    <h3 className="text-xl font-bold text-white flex gap-2"><Send className="text-[#8B5CF6]" /> Transferir {currency}</h3>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Código da Carteira de Destino</label>
                        <input required type="number" min="0" value={toWalletId} onChange={e => setToWalletId(e.target.value)} className="w-full bg-[#0B0E11] border border-[#2B3139] text-white rounded-xl p-3 focus:border-[#8B5CF6] outline-none transition-colors" placeholder="Ex: 15" />
                        <p className="text-xs text-gray-500 mt-1">Peça o código ID da carteira para o destinatário.</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Valor</label>
                        <input 
                            required 
                            type="number" 
                            min="0" // Bloqueio no HTML
                            step="0.00000001" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-full bg-[#0B0E11] border border-[#2B3139] text-white rounded-xl p-3 focus:border-[#8B5CF6] outline-none transition-colors" 
                            placeholder="0.00" 
                        />
                    </div>
                    {/* Botão ROXO */}
                    <button disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl flex justify-center transition-all shadow-lg shadow-[#8B5CF6]/20">
                        {loading ? <Loader2 className="animate-spin" /> : "Confirmar Envio"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};