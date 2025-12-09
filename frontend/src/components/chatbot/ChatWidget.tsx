"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import walletService from "@/services/walletService";
import userService from "@/services/userService";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string, from: 'bot' | 'user' }[]>([
        { text: "Olá! Eu sou o assistente Lunaria. Pergunte sobre seu saldo ou faça trades (ex: 'comprar BTC 100').", from: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input;
        setInput("");
        setMessages(prev => [...prev, { text: msg, from: 'user' }]);
        setLoading(true);

        try {
            const user = await userService.getProfile();
            const res = await walletService.sendMessage(Number(user.id), msg);
            setMessages(prev => [...prev, { text: res.reply, from: 'bot' }]);
        } catch {
            setMessages(prev => [...prev, { text: "Erro ao conectar com o assistente.", from: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden mb-4">
                        <div className="p-4 bg-[#8B5CF6] flex justify-between items-center text-white">
                            <div className="flex items-center gap-2 font-bold"><Bot size={20} /> Assistente IA</div>
                            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0E11]" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.from === 'user' ? 'bg-[#8B5CF6] text-white rounded-tr-none' : 'bg-[#2B3139] text-[#EAECEF] rounded-tl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="flex justify-start"><div className="bg-[#2B3139] p-3 rounded-xl rounded-tl-none"><Loader2 className="animate-spin text-[#8B5CF6]" size={16} /></div></div>}
                        </div>
                        <div className="p-3 bg-[#1E2329] border-t border-[#2B3139] flex gap-2">
                            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Digite sua mensagem..." className="flex-1 bg-[#0B0E11] border border-[#2B3139] rounded-lg px-3 py-2 text-white text-sm focus:border-[#8B5CF6] outline-none" />
                            <button onClick={handleSend} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2 rounded-lg"><Send size={18} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <button onClick={() => setIsOpen(!isOpen)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-4 rounded-full shadow-lg shadow-[#8B5CF6]/40 transition-all hover:scale-110">
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};