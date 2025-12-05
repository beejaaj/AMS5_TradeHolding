"use client";

import React, { useEffect, useState } from "react";
import { currencyAPI } from "@/services/API";
import { Currency } from "../../services/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Coins, 
  ChevronRight,
  Loader2
} from "lucide-react";
import "./CurrencyList.css";

export const CurrencyList = ({
    onSelect,
}: {
    onSelect: (currency: Currency) => void;
}) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchCurrencies();
    }, []);

    // Filtro de pesquisa em tempo real
    useEffect(() => {
        const results = currencies.filter(c => 
            c.name.toLowerCase().includes(search.toLowerCase()) || 
            c.symbol.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCurrencies(results);
    }, [search, currencies]);

    async function fetchCurrencies() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(currencyAPI.getAllCurrency(), {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Falha ao carregar as moedas");
            const data = await res.json();
            setCurrencies(data);
            setFilteredCurrencies(data);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar a lista.");
        } finally {
            setLoading(false);
        }
    }

    const handleClick = (currency: Currency) => {
        setSelectedId(currency.id!);
        onSelect(currency);
        setMenuOpenId(null);
    };

    const toggleMenu = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Impede seleção da linha ao clicar no menu
        setMenuOpenId((prevId) => (prevId === id ? null : id));
    };

    const handleEdit = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setMenuOpenId(null);
        router.push(`/currency/edit/${id}`);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!window.confirm("Tem certeza que deseja excluir esta moeda?")) return;

        setDeleting(true);
        try {
            const res = await fetch(currencyAPI.deleteCurrency(id), { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir");
            
            // Atualiza estado local sem precisar refetch total (mais rápido)
            const updatedList = currencies.filter(c => c.id !== id);
            setCurrencies(updatedList);
            setFilteredCurrencies(updatedList); // Atualiza filtro também

            if (selectedId === id) {
                setSelectedId(null);
                onSelect(null as any);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDeleting(false);
            setMenuOpenId(null);
        }
    };

    // Fecha menu ao clicar fora (efeito simples)
    useEffect(() => {
        const closeMenu = () => setMenuOpenId(null);
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#1E2329] rounded-2xl border border-[#2B3139] shadow-xl overflow-hidden">
            {/* Header com Busca */}
            <div className="p-4 border-b border-[#2B3139] space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#EAECEF] flex items-center gap-2">
                        <Coins className="text-[#8B5CF6]" size={24} />
                        Ativos
                    </h2>
                    <Link href="/currency/create">
                        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2 rounded-lg transition-colors shadow-lg shadow-[#8B5CF6]/20" title="Nova Moeda">
                            <Plus size={20} />
                        </button>
                    </Link>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar moeda..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all placeholder-[#474D57]"
                    />
                </div>
            </div>

            {/* Lista de Moedas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-40 text-[#848E9C] gap-3">
                        <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
                        <span className="text-sm">Carregando mercado...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-[#F6465D] bg-[#F6465D]/10 m-4 rounded-lg text-sm border border-[#F6465D]/20">
                        {error}
                    </div>
                ) : (
                    <ul className="divide-y divide-[#2B3139]">
                        <AnimatePresence>
                            {filteredCurrencies.length === 0 && (
                                <motion.li 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="p-8 text-center text-[#848E9C] italic text-sm"
                                >
                                    Nenhum ativo encontrado.
                                </motion.li>
                            )}
                            
                            {filteredCurrencies.map((c, index) => (
                                <motion.li
                                    key={c.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleClick(c)}
                                    className={`
                                        relative group cursor-pointer p-4 transition-all duration-200
                                        hover:bg-[#2B3139]
                                        ${selectedId === c.id ? "bg-[#2B3139] border-l-4 border-[#8B5CF6]" : "border-l-4 border-transparent"}
                                    `}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar Simulado da Moeda */}
                                            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold text-sm border border-[#8B5CF6]/20">
                                                {c.symbol.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#EAECEF] flex items-center gap-2">
                                                    {c.symbol}
                                                    {selectedId === c.id && <ChevronRight size={14} className="text-[#8B5CF6]" />}
                                                </div>
                                                <div className="text-xs text-[#848E9C] font-medium">{c.name}</div>
                                            </div>
                                        </div>

                                        {/* Botão de Menu */}
                                        <button 
                                            onClick={(e) => toggleMenu(e, c.id!)}
                                            className={`p-1.5 rounded-full hover:bg-[#474D57] transition-colors ${menuOpenId === c.id ? 'text-[#EAECEF] bg-[#474D57]' : 'text-[#848E9C]'}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {menuOpenId === c.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute right-4 top-12 w-32 bg-[#1E2329] border border-[#2B3139] rounded-lg shadow-2xl z-20 overflow-hidden"
                                            >
                                                <button
                                                    onClick={(e) => handleEdit(e, c.id!)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EAECEF] hover:bg-[#2B3139] hover:text-[#8B5CF6] transition-colors text-left"
                                                >
                                                    <Edit size={14} /> Editar
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, c.id!)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#F6465D] hover:bg-[#F6465D]/10 transition-colors text-left"
                                                >
                                                    {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14} />} 
                                                    Excluir
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </div>
    );
};