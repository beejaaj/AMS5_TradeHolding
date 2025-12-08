"use client";

import React, { useEffect, useState } from "react";
import { historyAPI } from "@/services/API";
import { History } from "@/services/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
    ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, Calendar, Loader2 
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

export const CurrencyHistory = ({ currencyId }: { currencyId: string }) => {
    const [history, setHistory] = useState<History[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (currencyId) fetchHistory();
    }, [currencyId]);

    async function fetchHistory() {
        setLoading(true);
        try {
            const res = await fetch(historyAPI.GetByCurrency(currencyId));
            if (res.ok) {
                const data: History[] = await res.json();
                // Ordena do mais recente para o mais antigo
                setHistory(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setLoading(false);
        }
    }

    // Lógica de Paginação (Client-Side)
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="bg-[#1E2329] rounded-2xl border border-[#2B3139] shadow-xl overflow-hidden mt-6">
            <div className="p-5 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                <h3 className="text-lg font-bold text-[#EAECEF]">Histórico de Transações</h3>
                <span className="text-xs font-semibold text-[#848E9C] bg-[#2B3139] px-2.5 py-1 rounded-md">
                    {history.length} Operações
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#848E9C] uppercase bg-[#0B0E11] border-b border-[#2B3139]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Data</th>
                            <th className="px-6 py-4 font-semibold text-right">Valor</th>
                            <th className="px-6 py-4 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B3139]">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center">
                                    <div className="flex justify-center items-center gap-2 text-[#848E9C]">
                                        <Loader2 className="animate-spin" size={18} /> Carregando...
                                    </div>
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-[#848E9C]">Nenhum registro encontrado.</td></tr>
                        ) : (
                            currentItems.map((h) => (
                                <tr key={h.id} className="hover:bg-[#2B3139]/50 transition-colors bg-[#1E2329]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* Ícone baseado em lógica simples (se valor positivo/negativo ou tipo) */}
                                            <div className="w-8 h-8 rounded-full bg-[#2B3139] flex items-center justify-center text-[#EAECEF]">
                                                <ArrowUpRight size={16} className="text-[#0ECB81]" />
                                            </div>
                                            <span className="font-medium text-[#EAECEF]">Movimentação</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#848E9C]">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14}/>
                                            {format(new Date(h.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-[#EAECEF]">
                                        R$ {h.value.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[#0ECB81] text-xs bg-[#0ECB81]/10 px-2 py-1 rounded font-bold">
                                            Confirmado
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rodapé de Paginação */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-[#2B3139] flex justify-between items-center bg-[#0B0E11]">
                    <span className="text-xs text-[#848E9C]">
                        Página <span className="text-[#EAECEF] font-bold">{currentPage}</span> de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-lg bg-[#2B3139] text-[#EAECEF] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#474D57] transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-lg bg-[#2B3139] text-[#EAECEF] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#474D57] transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};