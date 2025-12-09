"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currencyAPI } from "@/services/API";
import { motion } from "framer-motion";
import { 
  Coins, FileText, Wallet, CheckCircle, AlertCircle, ArrowLeft, Loader2, Save 
} from "lucide-react";
import Link from "next/link";

export const EditCurrency = ({ id }: { id: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        symbol: "",
        name: "",
        description: "",
        backing: "",
        status: "",
        reverse: false
    });

    useEffect(() => {
        if (id) fetchCurrency();
    }, [id]);

    async function fetchCurrency() {
        try {
            const res = await fetch(currencyAPI.getCurrencyDetails(id));
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    symbol: data.symbol,
                    name: data.name,
                    description: data.description || "",
                    backing: data.backing,
                    status: data.status,
                    reverse: data.reverse || false
                });
            } else {
                alert("Moeda não encontrada.");
                router.push("/currency");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitialLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, reverse: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(currencyAPI.updateCurrency(id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/currency");
            } else {
                alert("Erro ao atualizar.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-[#8B5CF6]" size={48} /></div>;
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                            <Coins className="text-[#8B5CF6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#EAECEF]">Editar Ativo</h2>
                            <p className="text-sm text-[#848E9C]">Atualize as informações de {formData.symbol}.</p>
                        </div>
                    </div>
                    <Link href="/currency">
                        <button className="text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139] p-2 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#848E9C] uppercase">Símbolo</label>
                            <input
                                required
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] transition-all uppercase"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#848E9C] uppercase">Nome</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#848E9C] uppercase">Descrição</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 text-[#848E9C]" size={18} />
                            <textarea
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6] resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#848E9C] uppercase">Lastro</label>
                            <div className="relative">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                                <select
                                    name="backing"
                                    value={formData.backing}
                                    onChange={handleChange}
                                    className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6]"
                                >
                                    <option value="Crypto">Criptomoeda</option>
                                    <option value="USDT">Dólar (USDT)</option>
                                    <option value="BRL">Real (BRL)</option>
                                    <option value="Gold">Ouro</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#848E9C] uppercase">Status</label>
                            <div className="relative">
                                {formData.status === 'Ativo' 
                                    ? <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ECB81]" size={18} />
                                    : <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6465D]" size={18} />
                                }
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8B5CF6]"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Suspenso</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#0B0E11] rounded-xl border border-[#2B3139]">
                        <input
                            type="checkbox"
                            id="reverseEdit"
                            checked={formData.reverse}
                            onChange={handleCheckbox}
                            className="w-5 h-5 rounded border-gray-600 text-[#8B5CF6] focus:ring-[#8B5CF6] bg-[#1E2329]"
                        />
                        <label htmlFor="reverseEdit" className="text-sm text-[#EAECEF] cursor-pointer select-none">
                            <span className="font-bold">Inverter Cotação?</span> (1/Preço)
                        </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Link href="/currency" className="flex-1">
                            <button type="button" className="w-full bg-[#2B3139] hover:bg-[#474D57] text-[#EAECEF] font-bold py-4 rounded-xl transition-all">
                                Cancelar
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/20 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salvar Alterações</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};