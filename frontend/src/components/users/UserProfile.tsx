"use client";

import React, { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const UserProfile = ({ id }: { id: string }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = id === "me" 
                    ? await userService.getProfile() 
                    : await userService.getById(Number(id));
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) return <div className="text-center text-[#848E9C] mt-20">Carregando perfil...</div>;

    // Verifica se tem foto válida (Base64 longo) ou se é default
    const hasPhoto = user.photo && user.photo.length > 50 && user.photo !== "default.png";

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-4">
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl -z-10 group-hover:bg-[#8B5CF6]/20 transition-all duration-700" />

                <div className="p-8 text-center border-b border-[#2B3139] bg-[#1E2329] relative">
                    <Link href="/users" className="absolute left-6 top-6 text-[#848E9C] hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    
                    <div className="w-28 h-28 mx-auto bg-[#0B0E11] border-2 border-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20 overflow-hidden relative">
                        {hasPhoto ? (
                            <Image src={user.photo} alt={user.name} fill className="object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-[#EAECEF]">
                                {user.name.substring(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
                    <p className="text-[#848E9C]">Membro da Lunaria</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-[#0B0E11]/50 rounded-xl border border-[#2B3139]">
                        <Mail className="text-[#8B5CF6]" size={20} />
                        <div>
                            <p className="text-xs text-[#848E9C] uppercase font-bold">Email</p>
                            <p className="text-[#EAECEF] break-all">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-[#0B0E11]/50 rounded-xl border border-[#2B3139]">
                        <Phone className="text-[#8B5CF6]" size={20} />
                        <div>
                            <p className="text-xs text-[#848E9C] uppercase font-bold">Telefone</p>
                            <p className="text-[#EAECEF]">{user.phone || "Não informado"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-[#0B0E11]/50 rounded-xl border border-[#2B3139]">
                        <MapPin className="text-[#8B5CF6]" size={20} />
                        <div>
                            <p className="text-xs text-[#848E9C] uppercase font-bold">Endereço</p>
                            <p className="text-[#EAECEF]">{user.address || "Não informado"}</p>
                        </div>
                    </div>

                    <Link href={`/users/edit/${user.id}`}>
                        <button className="w-full mt-4 py-3 bg-[#2B3139] hover:bg-[#8B5CF6] hover:text-white text-[#EAECEF] font-bold rounded-xl transition-all flex justify-center items-center gap-2">
                            <Edit size={18} /> Editar Perfil
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};