"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Download, Loader2, Coins } from "lucide-react";
import { currencyAPI } from "@/services/API";

// Lista simulada das principais moedas da Binance para importação
const BINANCE_COINS = [
  { symbol: "BTC", name: "Bitcoin", backing: "USDT" },
  { symbol: "ETH", name: "Ethereum", backing: "USDT" },
  { symbol: "BNB", name: "Binance Coin", backing: "USDT" },
  { symbol: "SOL", name: "Solana", backing: "USDT" },
  { symbol: "ADA", name: "Cardano", backing: "USDT" },
  { symbol: "XRP", name: "Ripple", backing: "USDT" },
  { symbol: "DOT", name: "Polkadot", backing: "USDT" },
  { symbol: "DOGE", name: "Dogecoin", backing: "USDT" },
  { symbol: "LTC", name: "Litecoin", backing: "USDT" },
  { symbol: "MATIC", name: "Polygon", backing: "USDT" },
  { symbol: "AVAX", name: "Avalanche", backing: "USDT" },
  { symbol: "LINK", name: "Chainlink", backing: "USDT" },
];

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportCurrencyModal = ({ isOpen, onClose, onSuccess }: ImportModalProps) => {
  const [search, setSearch] = useState("");
  const [importingSymbol, setImportingSymbol] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCoins = BINANCE_COINS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleImport = async (coin: typeof BINANCE_COINS[0]) => {
    setImportingSymbol(coin.symbol);
    try {
      const payload = {
        symbol: coin.symbol,
        name: coin.name,
        description: `Ativo importado da Binance (${coin.name})`,
        status: "Ativo",
        backing: coin.backing,
        reverse: false
      };

      await fetch(currencyAPI.registerCurrency(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      setTimeout(() => {
        setImportingSymbol(null);
        onSuccess(); 
      }, 800);

    } catch (error) {
      console.error("Erro ao importar:", error);
      setImportingSymbol(null);
      alert("Não foi possível importar. Verifique se a moeda já existe.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header - Cor Roxa no Ícone */}
        <div className="p-5 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
          <h3 className="text-xl font-bold text-[#EAECEF] flex items-center gap-2">
            <Coins className="text-[#8B5CF6]" size={24} /> 
            Importar da Binance
          </h3>
          <button onClick={onClose} className="text-[#848E9C] hover:text-[#EAECEF] p-2 hover:bg-[#2B3139] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Busca - Foco Roxo */}
        <div className="p-4 border-b border-[#2B3139] bg-[#15181D]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
            <input
              type="text"
              placeholder="Buscar ativo (ex: BTC, ETH)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6] transition-all placeholder-[#474D57]"
              autoFocus
            />
          </div>
        </div>

        {/* Lista - Botões Roxos */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-[#0B0E11]">
          {filteredCoins.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-[#848E9C]">
              <Search size={40} className="mb-3 opacity-20" />
              <p>Nenhuma moeda encontrada.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredCoins.map((coin) => (
                <li
                  key={coin.symbol}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1E2329] border border-transparent hover:border-[#2B3139] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2B3139] flex items-center justify-center text-[#EAECEF] font-bold text-xs group-hover:bg-[#2B3139]/80 border border-[#2B3139] group-hover:border-[#8B5CF6]/30 transition-colors">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[#EAECEF] flex items-center gap-2">
                        {coin.symbol}
                        <span className="text-[10px] bg-[#2B3139] text-[#848E9C] px-1.5 py-0.5 rounded border border-[#474D57]">
                          {coin.backing}
                        </span>
                      </div>
                      <div className="text-xs text-[#848E9C]">{coin.name}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleImport(coin)}
                    disabled={importingSymbol !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                      ${importingSymbol === coin.symbol 
                        ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/50"
                        : "bg-[#2B3139] text-[#EAECEF] hover:bg-[#8B5CF6] hover:text-white border border-[#474D57] hover:border-[#8B5CF6]"
                      }`}
                  >
                    {importingSymbol === coin.symbol ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Importando
                      </>
                    ) : (
                      <>
                        <Download size={14} /> Importar
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};