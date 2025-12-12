"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";
import { motion } from "framer-motion";
import { UserPlus, Mail, User, Phone, MapPin, Lock, Save, Loader2, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const RegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        photo: "" // Será preenchido com Base64
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Converte a imagem para Base64
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // Limite de 5MB (opcional)
                alert("A imagem deve ter no máximo 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                setFormData(prev => ({ ...prev, photo: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.register(formData);
            router.push("/users/login");
        } catch (error) {
            alert("Erro ao cadastrar.");
        } finally {
            setLoading(false);
        }
    };

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
                            <UserPlus className="text-[#8B5CF6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#EAECEF]">Novo Usuário</h2>
                            <p className="text-sm text-[#848E9C]">Preencha os dados de acesso.</p>
                        </div>
                    </div>
                    <Link href="/users">
                        <button className="text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139] p-2 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Upload de Foto */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#2B3139] group-hover:border-[#8B5CF6] transition-colors bg-[#0B0E11] flex items-center justify-center relative">
                                {preview ? (
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <User className="text-[#848E9C]" size={64} />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={32} />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handlePhotoChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <p className="text-xs text-[#848E9C] mt-2">Clique para adicionar uma foto</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl pl-12 pr-4 py-3 focus:border-[#8B5CF6] outline-none transition-all" placeholder="Nome do usuário" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl pl-12 pr-4 py-3 focus:border-[#8B5CF6] outline-none transition-all" placeholder="email@exemplo.com" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl pl-12 pr-4 py-3 focus:border-[#8B5CF6] outline-none transition-all" placeholder="(00) 00000-0000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl pl-12 pr-4 py-3 focus:border-[#8B5CF6] outline-none transition-all" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase">Endereço</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                            <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl pl-12 pr-4 py-3 focus:border-[#8B5CF6] outline-none transition-all" placeholder="Endereço completo" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/20 flex justify-center items-center gap-2 mt-4">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Cadastrar Usuário</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};