"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import walletService from "@/services/walletService";
import userService from "@/services/userService";
import { Wallet } from "@/services/types";
import { Plus, Wallet as WalletIcon, ArrowDownCircle, ArrowRightLeft, RefreshCw } from "lucide-react";
import { CreateWalletModal } from "@/components/wallet/CreateWalletModal";
import { DepositModal } from "@/components/wallet/DepositModal";
import { TradeModal } from "@/components/wallet/TradeModal";

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'create' | 'deposit' | 'trade' | null>(null);

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const user = await userService.getProfile();
            const data = await walletService.getUserWallets(Number(user.id));
            setWallets(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchWallets(); }, []);

    return (
        <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <NavBar />
            
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Minhas Carteiras</h1>
                        <p className="text-[#848E9C]">Gerencie seus saldos e ativos.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setModal('trade')} className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#FCD535] hover:text-[#1E2329] rounded-xl font-bold transition-all"><ArrowRightLeft size={18} /> Trade</button>
                        <button onClick={() => setModal('deposit')} className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#0ECB81] hover:text-white rounded-xl font-bold transition-all"><ArrowDownCircle size={18} /> Depositar</button>
                        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B5CF6]/20"><Plus size={18} /> Nova Carteira</button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-[#848E9C]"><RefreshCw className="animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wallets.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-[#1E2329] rounded-2xl border border-[#2B3139] text-[#848E9C]">Você ainda não possui carteiras. Crie uma para começar!</div>
                        ) : wallets.map(w => (
                            <div key={w.id} className="bg-[#1E2329] border border-[#2B3139] p-6 rounded-2xl shadow-xl hover:border-[#8B5CF6]/50 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl -z-10 group-hover:bg-[#8B5CF6]/10 transition-all" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-[#0B0E11] rounded-xl text-[#8B5CF6] font-bold text-xl border border-[#2B3139]">{w.currencySymbol.substring(0, 2)}</div>
                                    <span className="text-xs bg-[#2B3139] px-2 py-1 rounded text-[#848E9C] uppercase">{w.currencySymbol}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{w.name}</h3>
                                <p className="text-2xl font-mono text-[#EAECEF]">{w.balance.toFixed(2)} <span className="text-sm text-[#848E9C]">{w.currencySymbol}</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateWalletModal isOpen={modal === 'create'} onClose={() => setModal(null)} onSuccess={fetchWallets} />
            <DepositModal isOpen={modal === 'deposit'} onClose={() => setModal(null)} onSuccess={fetchWallets} wallets={wallets} />
            <TradeModal isOpen={modal === 'trade'} onClose={() => setModal(null)} onSuccess={fetchWallets} wallets={wallets} />
        </div>
    );
}