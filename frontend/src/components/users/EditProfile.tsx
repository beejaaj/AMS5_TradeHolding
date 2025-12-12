"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userService, { User } from "@/services/userService";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Phone, MapPin, Save, Loader2, ArrowLeft, Camera, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const EditProfile = ({ id }: { id: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<User>({
        id: "", 
        name: "",
        email: "",
        phone: "",
        address: "",
        photo: "",
        password: "" // Campo de senha adicionado
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = id === "me" 
                    ? await userService.getProfile() 
                    : await userService.getById(id);
                
                // IMPORTANTE: Limpa a senha para não exibir o hash e permitir edição limpa
                setFormData({ ...data, password: "" });
                
                if (data.photo && data.photo !== "default.png" && data.photo.length > 20) {
                    setPreview(data.photo);
                }
            } catch (error) {
                console.error(error);
                router.push("/users");
            }
        };
        fetchUser();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
            if (formData.id) {
                // O backend deve tratar: se password vier vazio, não altera.
                await userService.update(formData.id, formData);
                router.push("/users");
            }
        } catch (error) {
            alert("Erro ao atualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-2xl w-full max-w-2xl"
            >
                <div className="p-6 border-b border-[#2B3139] flex justify-between items-center bg-[#1E2329]">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                            <UserIcon className="text-[#8B5CF6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#EAECEF]">Editar Perfil</h2>
                            <p className="text-sm text-[#848E9C]">Atualize as informações do usuário.</p>
                        </div>
                    </div>
                    <Link href="/users">
                        <button className="text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139] p-2 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Foto */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#2B3139] group-hover:border-[#8B5CF6] transition-colors bg-[#0B0E11] flex items-center justify-center relative">
                                {preview ? (
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-[#8B5CF6]">
                                        {formData.name ? formData.name.substring(0, 2).toUpperCase() : "--"}
                                    </span>
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
                        <p className="text-xs text-[#848E9C] mt-2">Alterar foto de perfil</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Nome</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Telefone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#848E9C] uppercase">Endereço</label>
                            <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none" />
                        </div>
                    </div>

                    {/* CAMPO DE SENHA ADICIONADO */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#848E9C] uppercase flex items-center gap-2">
                            <Lock size={12} /> Nova Senha (Opcional)
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password || ""} 
                            onChange={handleChange} 
                            placeholder="Deixe em branco para manter a senha atual"
                            className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] rounded-xl px-4 py-3 focus:border-[#8B5CF6] outline-none placeholder:text-[#2B3139]" 
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salvar Alterações</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};