"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import walletService from "@/services/walletService";
import userService from "@/services/userService";
import { ArrowLeft, Copy, Send, ArrowDownCircle, ArrowUpCircle, RefreshCw, Wallet as WalletIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { TransferModal } from "@/components/wallet/TransferModal";
import { Transaction, Wallet } from "@/services/types";

export default function WalletDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    
    // Dados completos vindos da API
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Guarda TODAS
    
    // Dados exibidos na página atual
    const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]); 
    
    const [loading, setLoading] = useState(true);
    const [showTransfer, setShowTransfer] = useState(false);
    
    // Controle de Paginação (Frontend)
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const user = await userService.getProfile();
            // Busca TUDO do backend
            const res = await walletService.getWalletDetails(Number(user.id), Number(id));
            
            setWallet(res.wallet || res.Wallet); // Compatibilidade com minúscula/maiúscula
            setAllTransactions(res.transactions || res.Transactions || []);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar detalhes da carteira.");
            router.push("/wallets");
        } finally { setLoading(false); }
    };

    // Carrega dados iniciais
    useEffect(() => { if(id) fetchDetails(); }, [id]);

    // Efeito para "fatiar" a lista sempre que a página ou a lista total mudar
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedTransactions(allTransactions.slice(startIndex, endIndex));
    }, [currentPage, allTransactions]);

    const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && !wallet) return <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center"><RefreshCw className="animate-spin text-[#8B5CF6]" /></div>;
    if (!wallet) return null;

    return (
        <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pt-20 pb-12 px-4">
            <NavBar />
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.push("/wallets")} className="flex items-center gap-2 text-[#848E9C] hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} /> Voltar para Carteiras
                </button>

                {/* Card Principal */}
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl hover:border-[#8B5CF6]/30 transition-all">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <WalletIcon className="text-[#8B5CF6]" size={28} />
                                <h1 className="text-2xl font-bold text-white">{wallet.name}</h1>
                            </div>
                            <div className="flex items-center gap-3 bg-[#0B0E11] px-4 py-2 rounded-xl border border-[#2B3139] w-fit shadow-inner">
                                <span className="text-[#848E9C] text-xs font-bold uppercase">CÓDIGO:</span>
                                <span className="text-[#8B5CF6] font-bold font-mono text-lg">{wallet.id}</span>
                                <button onClick={() => {navigator.clipboard.writeText(wallet.id.toString()); alert("Código copiado!");}} className="text-[#848E9C] hover:text-white ml-2 transition-colors"><Copy size={16} /></button>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                             <div className="text-sm text-[#848E9C] mb-1 uppercase tracking-wider font-bold">Saldo Disponível</div>
                             <div className="text-4xl font-mono text-white tracking-tight">
                                {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} 
                                <span className="text-[#8B5CF6] text-lg ml-2">{wallet.currencySymbol}</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setShowTransfer(true)} className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8B5CF6]/20">
                            <Send size={20} /> Transferir para outro Usuário
                        </button>
                    </div>
                </div>

                {/* Histórico com Paginação (FRONTEND ONLY) */}
                <h2 className="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-[#8B5CF6]">Histórico de Transações</h2>
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[400px]">
                    <div className="flex-1">
                        {displayedTransactions.length === 0 ? (
                            <div className="p-12 text-center text-[#848E9C] flex flex-col items-center gap-3 h-full justify-center">
                                <RefreshCw size={32} className="opacity-20" />
                                <p>Nenhuma transação encontrada.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#2B3139]">
                                {displayedTransactions.map((t) => (
                                    <div key={t.id} className="p-5 flex justify-between items-center hover:bg-[#2B3139]/50 transition-colors animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${t.amount >= 0 ? 'bg-[#0ECB81]/10 text-[#0ECB81]' : 'bg-[#F6465D]/10 text-[#F6465D]'}`}>
                                                {t.amount >= 0 ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{t.type.replace(/_/g, ' ')}</div>
                                                <div className="text-sm text-[#848E9C]">{t.description}</div>
                                            </div>
                                        </div>
                                        <div className={`font-mono font-bold text-lg ${t.amount >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                                            {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} {t.currencySymbol}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Controles de Paginação - Exibe apenas se tiver mais de 1 página */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B3139] hover:bg-[#8B5CF6] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm"
                            >
                                <ChevronLeft size={16} /> Anterior
                            </button>
                            
                            <span className="text-[#848E9C] text-sm font-mono">
                                Página <span className="text-white font-bold">{currentPage}</span> de {totalPages}
                            </span>

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B3139] hover:bg-[#8B5CF6] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm"
                            >
                                Próximo <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TransferModal 
                isOpen={showTransfer} 
                onClose={() => setShowTransfer(false)} 
                onSuccess={fetchDetails} 
                walletId={wallet.id} 
                currency={wallet.currencySymbol} 
            />
        </div>
    );
}