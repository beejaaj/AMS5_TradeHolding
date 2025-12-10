"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import walletService from "@/services/walletService";
import userService from "@/services/userService";
import { Wallet } from "@/services/types";
import { Plus, ArrowDownCircle, ArrowRightLeft, RefreshCw, Wallet as WalletIcon } from "lucide-react";
import { CreateWalletModal } from "@/components/wallet/CreateWalletModal";
import { DepositModal } from "@/components/wallet/DepositModal";
import { TradeModal } from "@/components/wallet/TradeModal";

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState<'create' | 'deposit' | 'trade' | null>(null);

    const fetchWallets = async () => {
        setLoading(true);
        setError("");
        try {
            const user = await userService.getProfile();
            // Garante que o ID seja numérico para a API de Wallet se ela esperar int
            const userId = Number(user.id);
            if (!userId) throw new Error("ID de usuário inválido");

            const data = await walletService.getUserWallets(userId);
            setWallets(data);
        } catch (e: any) { 
            console.error(e);
            setError("Não foi possível carregar suas carteiras.");
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchWallets(); }, []);

    return (
        <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <NavBar />
            
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <WalletIcon className="text-[#8B5CF6]" size={32} /> Minhas Carteiras
                        </h1>
                        <p className="text-[#848E9C] mt-1">Gerencie seus saldos e ativos digitais.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setModal('trade')} className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#FCD535] hover:text-[#1E2329] rounded-xl font-bold transition-all border border-[#474D57] hover:border-[#FCD535] shadow-lg">
                            <ArrowRightLeft size={18} /> Trade
                        </button>
                        <button onClick={() => setModal('deposit')} className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#0ECB81] hover:text-white rounded-xl font-bold transition-all border border-[#474D57] hover:border-[#0ECB81] shadow-lg">
                            <ArrowDownCircle size={18} /> Depositar
                        </button>
                        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B5CF6]/20">
                            <Plus size={18} /> Nova Carteira
                        </button>
                    </div>
                </div>

                {/* Lista de Carteiras */}
                {loading ? (
                    <div className="flex justify-center py-20 text-[#848E9C] flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-[#8B5CF6]" size={40} />
                        <p>Sincronizando carteiras...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center bg-[#1E2329] rounded-2xl border border-[#F6465D]/30 text-[#F6465D]">
                        {error}
                        <button onClick={fetchWallets} className="block mx-auto mt-4 text-sm underline hover:text-white">Tentar novamente</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wallets.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-[#1E2329] rounded-2xl border border-[#2B3139] border-dashed">
                                <WalletIcon size={48} className="mx-auto text-[#848E9C] mb-4 opacity-50" />
                                <p className="text-[#848E9C] mb-4">Você ainda não possui carteiras.</p>
                                <button onClick={() => setModal('create')} className="text-[#8B5CF6] font-bold hover:underline">Criar sua primeira carteira</button>
                            </div>
                        ) : wallets.map(w => (
                            <div key={w.id} className="bg-[#1E2329] border border-[#2B3139] p-6 rounded-2xl shadow-xl hover:border-[#8B5CF6]/50 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl -z-10 group-hover:bg-[#8B5CF6]/10 transition-all" />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-[#0B0E11] rounded-xl text-[#8B5CF6] font-bold text-xl border border-[#2B3139] shadow-inner">
                                        {w.currencySymbol ? w.currencySymbol.substring(0, 2).toUpperCase() : "$"}
                                    </div>
                                    <span className="text-xs bg-[#2B3139] px-2 py-1 rounded text-[#848E9C] uppercase font-bold tracking-wider border border-[#474D57]">
                                        {w.currencySymbol}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-white mb-1 truncate" title={w.name}>{w.name}</h3>
                                <p className="text-3xl font-mono text-[#EAECEF] tracking-tight flex items-baseline gap-1">
                                    {w.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                    <span className="text-sm text-[#848E9C] font-sans">{w.currencySymbol}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modais */}
            <CreateWalletModal isOpen={modal === 'create'} onClose={() => setModal(null)} onSuccess={fetchWallets} />
            <DepositModal isOpen={modal === 'deposit'} onClose={() => setModal(null)} onSuccess={fetchWallets} wallets={wallets} />
            <TradeModal isOpen={modal === 'trade'} onClose={() => setModal(null)} onSuccess={fetchWallets} wallets={wallets} />
        </div>
    );
}