"use client";

import React, { useState } from "react";
import { CurrencyList } from "./CurrencyList";
import { CurrencyDetails } from "./CurrencyDetails";
import { CurrencyHistory } from "./CurrencyHistory";
import { CurrencyChart } from "./CurrencyChart";
import { Currency } from "@/services/types";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

export const CurrencyDashboard = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 h-[calc(100vh-100px)]">
            
            {/* COLUNA ESQUERDA: LISTA */}
            <div className="lg:col-span-3 h-full">
                <CurrencyList onSelect={setSelectedCurrency} />
            </div>

            {/* COLUNA DIREITA: CONTEÚDO */}
            <div className="lg:col-span-9 h-full overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                    {selectedCurrency ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* 1. Detalhes */}
                            <CurrencyDetails currency={selectedCurrency} />
                            
                            {/* 2. Gráfico */}
                            <CurrencyChart currencySymbol={selectedCurrency.symbol} />
                            
                            {/* 3. Histórico Paginado */}
                            <CurrencyHistory currencyId={String(selectedCurrency.id!)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-[#848E9C] bg-[#1E2329] rounded-2xl border border-[#2B3139] p-8 shadow-xl"
                        >
                            <div className="w-24 h-24 bg-[#0B0E11] rounded-full flex items-center justify-center mb-6 border border-[#2B3139]">
                                <Coins size={48} className="text-[#8B5CF6] opacity-50" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#EAECEF] mb-2">Visão Geral de Mercado</h2>
                            <p className="max-w-md text-center">
                                Selecione um ativo na lista lateral para visualizar gráficos avançados, detalhes técnicos e histórico de operações.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};