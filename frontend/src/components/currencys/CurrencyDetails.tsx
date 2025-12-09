"use client";

import React, { useEffect, useState } from "react";
import { Currency } from "@/services/types";
import Link from "next/link";
import { Edit, Wallet, Info } from "lucide-react";

export const CurrencyDetails = ({ currency }: { currency: Currency }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    return (
        <div className="bg-[#1E2329] rounded-2xl border border-[#2B3139] p-6 shadow-xl relative overflow-hidden group">
            {/* Glow Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-3xl -z-10 group-hover:bg-[#8B5CF6]/10 transition-all duration-500" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    {/* Ícone Grande */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0E11] border border-[#2B3139] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#8B5CF6] shadow-lg shrink-0">
                        {currency.symbol.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                            {currency.name}
                            <span className="text-xs font-bold text-[#848E9C] bg-[#2B3139] px-2 py-0.5 rounded border border-[#474D57]">
                                {currency.symbol}
                            </span>
                        </h2>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                currency.status === 'Ativo' 
                                ? 'bg-[#0ECB81]/10 text-[#0ECB81] border-[#0ECB81]/20' 
                                : 'bg-[#F6465D]/10 text-[#F6465D] border-[#F6465D]/20'
                            }`}>
                                {currency.status || "Ativo"}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                                {currency.backing || "Crypto"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botão de Editar (Apenas Logado) */}
                {isLoggedIn && (
                    <Link href={`/currency/edit/${currency.id}`} className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#474D57] hover:text-white text-[#EAECEF] rounded-lg text-sm transition-all border border-[#474D57] shadow-sm">
                            <Edit size={16} /> <span className="font-medium">Editar Ativo</span>
                        </button>
                    </Link>
                )}
            </div>

            {/* Grid Responsivo de Informações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#0B0E11]/50 p-4 rounded-xl border border-[#2B3139] hover:border-[#8B5CF6]/30 transition-colors sm:col-span-2 md:col-span-1">
                    <p className="text-[#848E9C] text-xs font-bold uppercase mb-2 flex items-center gap-1">
                        <Info size={12}/> Descrição
                    </p>
                    <p className="text-[#EAECEF] text-sm leading-relaxed line-clamp-3">
                        {currency.description || "Sem descrição disponível para este ativo."}
                    </p>
                </div>
                
                <div className="bg-[#0B0E11]/50 p-4 rounded-xl border border-[#2B3139] flex flex-col justify-center hover:border-[#8B5CF6]/30 transition-colors">
                    <p className="text-[#848E9C] text-xs font-bold uppercase mb-1">Status de Mercado</p>
                    <div className="text-[#EAECEF] font-medium flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${currency.status === 'Ativo' ? 'bg-[#0ECB81] shadow-[0_0_8px_#0ECB81]' : 'bg-[#F6465D]'}`}></div>
                        {currency.status === 'Ativo' ? 'Negociação Aberta' : 'Suspenso'}
                    </div>
                </div>

                <div className="bg-[#0B0E11]/50 p-4 rounded-xl border border-[#2B3139] flex flex-col justify-center hover:border-[#8B5CF6]/30 transition-colors">
                    <p className="text-[#848E9C] text-xs font-bold uppercase mb-1">Tipo de Lastro</p>
                    <div className="text-white text-lg font-bold flex items-center gap-2">
                        <Wallet size={18} className="text-[#8B5CF6]"/>
                        {currency.backing}
                    </div>
                </div>
            </div>
        </div>
    );
};