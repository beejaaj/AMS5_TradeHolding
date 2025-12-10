"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, Loader2 } from "lucide-react";
import walletService from "@/services/walletService";
import userService from "@/services/userService";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string, from: 'bot' | 'user' }[]>([
        { text: "Olá! Sou o assistente Lunaria. Posso ajudar com seu saldo ou trades. Tente: 'Qual meu saldo?' ou 'Comprar BTC 100'.", from: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input;
        setInput("");
        setMessages(prev => [...prev, { text: msg, from: 'user' }]);
        setLoading(true);

        try {
            // Pega o ID do usuário logado para contextualizar a conversa
            const user = await userService.getProfile();
            const res = await walletService.sendMessage(Number(user.id), msg);
            
            // Adiciona resposta do bot
            setMessages(prev => [...prev, { text: res.reply, from: 'bot' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Desculpe, estou com dificuldades de conexão no momento.", from: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 20, scale: 0.9 }} 
                        className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header Chat */}
                        <div className="p-4 bg-[#8B5CF6] flex justify-between items-center text-white shadow-md">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="p-1 bg-white/20 rounded-full"><Bot size={18} /></div>
                                Assistente IA
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={20} /></button>
                        </div>

                        {/* Corpo Chat */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0E11]" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        m.from === 'user' 
                                        ? 'bg-[#8B5CF6] text-white rounded-tr-none' 
                                        : 'bg-[#2B3139] text-[#EAECEF] rounded-tl-none border border-[#474D57]'
                                    }`}>
                                        {m.text.split('\n').map((line, idx) => (
                                            <span key={idx}>{line}<br/></span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#2B3139] p-3 rounded-2xl rounded-tl-none border border-[#474D57] flex items-center gap-2 text-[#848E9C] text-xs">
                                        <Loader2 className="animate-spin text-[#8B5CF6]" size={14} /> Digitando...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-[#1E2329] border-t border-[#2B3139] flex gap-2">
                            <input 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                                placeholder="Digite sua mensagem..." 
                                className="flex-1 bg-[#0B0E11] border border-[#2B3139] rounded-xl px-4 py-2 text-white text-sm focus:border-[#8B5CF6] outline-none transition-all placeholder-[#474D57]" 
                            />
                            <button 
                                onClick={handleSend} 
                                disabled={!input.trim() || loading}
                                className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-[#8B5CF6]/20"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão Flutuante */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-4 rounded-full shadow-xl shadow-[#8B5CF6]/40 transition-all hover:scale-110 active:scale-95 border-2 border-[#1E2329]"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};