"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import chatbotService from "@/services/chatbotService"; 
import userService from "@/services/userService";
import { usePathname } from "next/navigation"; // <--- 1. Importar usePathname

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Olá! 👋 Sou seu assistente financeiro. Toque em uma opção abaixo ou digite sua dúvida.", sender: 'bot' }
    ]);
    
    const [suggestions, setSuggestions] = useState<string[]>([
        "Como funciona?", "Quais moedas tem?", "Ver meu saldo"
    ]);

    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Hook para detectar mudança de página
    const pathname = usePathname(); 

    // 2. Atualizado: Recarrega usuário ao mudar de página ou abrir o chat
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Tenta pegar o token do storage primeiro para evitar chamada de API desnecessária
                const token = localStorage.getItem("token");
                if (!token) {
                    setUserId(0);
                    return;
                }

                const user = await userService.getProfile();
                setUserId(user && user.id ? Number(user.id) : 0);
            } catch { 
                setUserId(0); 
            }
        };
        
        loadUser();
    }, [pathname, isOpen]); // <--- Dispara quando navega ou abre o chat

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages, isOpen, suggestions]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setSuggestions([]); 
        setLoading(true);

        try {
            // Usa o userId atualizado do estado
            const data = await chatbotService.sendMessage(userId, text);
            
            const botMsg: Message = { 
                id: Date.now() + 1, 
                text: data.reply || "Não entendi.", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botMsg]);
            
            if (data.suggestions && data.suggestions.length > 0) {
                setSuggestions(data.suggestions);
            } else {
                setSuggestions(["Ajuda", "Voltar ao início"]);
            }

        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now()+1, text: "Erro de conexão.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputText);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-[#1E2329] border border-[#2B3139] w-[90vw] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#2B3139] to-[#1E2329] p-4 flex justify-between items-center border-b border-[#474D57] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#8B5CF6] p-2 rounded-full shadow-lg shadow-[#8B5CF6]/20">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                        Assistente Virtual <Sparkles size={12} className="text-[#FCD535]" />
                                    </h3>
                                    <p className="text-[10px] text-[#848E9C]">
                                        {userId > 0 ? "● Conectado" : "○ Modo Visitante"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-[#848E9C] hover:text-white transition-colors"><X size={20} /></button>
                        </div>

                        {/* Área de Mensagens */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0B0E11]/50">
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-[#8B5CF6] text-white rounded-br-none' 
                                            : 'bg-[#2B3139] text-[#EAECEF] rounded-bl-none border border-[#474D57]'
                                    }`}>
                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#2B3139] p-3 rounded-2xl rounded-bl-none border border-[#474D57]">
                                        <Loader2 className="animate-spin text-[#8B5CF6]" size={16} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Área de Sugestões (Chips) */}
                        {suggestions.length > 0 && !loading && (
                            <div className="px-4 py-2 bg-[#1E2329] border-t border-[#2B3139] flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
                                {suggestions.map((sug, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => sendMessage(sug)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-[#2B3139] hover:bg-[#8B5CF6] border border-[#474D57] hover:border-[#8B5CF6] text-[#EAECEF] hover:text-white text-xs rounded-full transition-all active:scale-95"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleFormSubmit} className="p-3 bg-[#1E2329] border-t border-[#2B3139] shrink-0">
                            <div className="relative flex items-center gap-2">
                                <input 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Digite sua dúvida..."
                                    className="w-full bg-[#0B0E11] text-[#EAECEF] rounded-xl pl-4 pr-12 py-3 border border-[#2B3139] focus:border-[#8B5CF6] outline-none text-sm transition-all"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputText.trim() || loading}
                                    className="absolute right-2 p-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão Flutuante (Launcher) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-4 rounded-full shadow-xl shadow-[#8B5CF6]/40 transition-all flex items-center justify-center border-2 border-[#1E2329]"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    );
};