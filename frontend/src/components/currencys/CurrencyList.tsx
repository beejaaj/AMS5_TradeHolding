"use client";

import React, { useEffect, useState } from "react";
import { currencyAPI } from "@/services/API";
import { Currency } from "@/services/types";
import Link from "next/link";
import { 
  Plus, Search, Trash2, Coins, ChevronRight, Loader2, Edit, Download 
} from "lucide-react";
import { ImportCurrencyModal } from "./ImportCurrencyModal";
import { ConfirmModal } from "@/components/common/ConfirmModal"; // Importe o novo Modal

interface CurrencyListProps {
    onSelect: (c: Currency) => void;
    selectedId: string | null;
}

export const CurrencyList = ({ onSelect, selectedId }: CurrencyListProps) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Estados para o Modal de Exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currencyToDelete, setCurrencyToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchCurrencies();
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    async function fetchCurrencies() {
        setLoading(true);
        try {
            const res = await fetch(currencyAPI.getAllCurrency());
            if (res.ok) {
                const data = await res.json();
                setCurrencies(data);
                
                if (data.length > 0 && !selectedId) {
                    // Normaliza ID para garantir seleção
                    const first = data[0];
                    if(first.id || (first as any).Id) onSelect(first);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = currencies.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    // 1. Ao clicar na lixeira, apenas abre o modal e guarda o ID
    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setCurrencyToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // 2. A exclusão real acontece aqui
    const confirmDelete = async () => {
    if (!currencyToDelete) return;

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token não encontrado. Faça login novamente.");
            return;
        }

        const res = await fetch(currencyAPI.deleteCurrency(currencyToDelete), {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token.replace(/['"]+/g, '')}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            fetchCurrencies();
        } else {
            const text = await res.text();
            console.error("Erro backend:", text);
            alert("Erro ao excluir ativo.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro ao excluir.");
    } finally {
        setCurrencyToDelete(null);
        setIsDeleteModalOpen(false);
    }
};


    return (
        <>
            <div className="flex flex-col h-full bg-[#1E2329] rounded-2xl border border-[#2B3139] shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[#2B3139] space-y-4 bg-[#1E2329]">
                    <div className="flex justify-between items-center gap-2">
                        <h2 className="text-lg font-bold text-[#EAECEF] flex items-center gap-2 flex-1 truncate">
                            <Coins className="text-[#8B5CF6]" size={20} /> 
                            <span className="hidden xs:inline">Mercado</span>
                        </h2>
                        
                        {isLoggedIn && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsImportModalOpen(true)}
                                    className="bg-[#2B3139] hover:bg-[#8B5CF6] hover:text-white text-[#EAECEF] px-3 py-2 rounded-lg transition-all text-xs font-bold flex items-center gap-2 border border-[#474D57] hover:border-[#8B5CF6]"
                                    title="Importar da Binance"
                                >
                                    <Download size={16} /> 
                                    <span className="hidden sm:inline">Importar</span>
                                </button>

                                <Link href="/currency/create">
                                    <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2 rounded-lg transition-colors shadow-lg shadow-[#8B5CF6]/20">
                                        <Plus size={18} />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar ativos..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#8B5CF6] transition-all placeholder-[#474D57]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#8B5CF6]" /></div>
                    ) : (
                        <ul className="divide-y divide-[#2B3139]">
                            {filtered.map((c) => {
                                const itemId = c.id || (c as any).Id;
                                const isSelected = itemId && selectedId && String(itemId).toLowerCase() === String(selectedId).toLowerCase();

                                return (
                                    <li 
                                        key={itemId} 
                                        onClick={() => itemId && onSelect(c)}
                                        className={`p-4 cursor-pointer transition-all border-l-4 group relative
                                            ${isSelected 
                                                ? 'border-[#8B5CF6] bg-[#2B3139]' 
                                                : 'border-transparent hover:bg-[#2B3139] hover:border-[#8B5CF6]/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-10 h-10 min-w-[2.5rem] rounded-full border flex items-center justify-center font-bold text-xs transition-colors
                                                    ${isSelected 
                                                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' 
                                                        : 'bg-[#0B0E11] text-[#8B5CF6] border-[#2B3139] group-hover:border-[#8B5CF6]'
                                                    }`}>
                                                    {c.symbol.substring(0, 2)}
                                                </div>
                                                <div className="truncate">
                                                    <div className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-[#EAECEF]'}`}>
                                                        {c.symbol}
                                                    </div>
                                                    <div className="text-xs text-[#848E9C] truncate">{c.name}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {isSelected && <ChevronRight size={16} className="text-[#8B5CF6] mr-1"/>}
                                                
                                                {isLoggedIn && itemId && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <Link href={`/currency/edit/${itemId}`} onClick={(e) => e.stopPropagation()}>
                                                            <button className="p-1.5 text-[#474D57] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-md transition-colors">
                                                                <Edit size={16} />
                                                            </button>
                                                        </Link>
                                                        {/* Botão de Excluir Chama o Modal Agora */}
                                                        <button 
                                                            onClick={(e) => handleDeleteClick(e, itemId)} 
                                                            className="p-1.5 text-[#474D57] hover:text-[#F6465D] hover:bg-[#F6465D]/10 rounded-md transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            <ImportCurrencyModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => {
                    setIsImportModalOpen(false);
                    fetchCurrencies(); 
                }}
            />

            {/* Modal de Confirmação de Exclusão */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Ativo"
                message="Tem certeza que deseja remover esta moeda permanentemente? O histórico de preços associado também será perdido."
                isDestructive={true}
            />
        </>
    );
};