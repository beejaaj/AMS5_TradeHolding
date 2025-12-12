"use client";

import React, { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Users, Loader2 } from "lucide-react";
import { ConfirmModal } from "../common/ConfirmModal";
import Image from "next/image";

export const AllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    // CORREÇÃO: Aceita string ou number para cobrir todos os casos de ID
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await userService.delete(deleteId);
            fetchUsers();
        } catch(e) { alert("Erro ao deletar usuário"); }
        setDeleteId(null);
    };

    return (
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="p-6 border-b border-[#2B3139] bg-[#1E2329] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                        <Users className="text-[#8B5CF6]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#EAECEF]">Gerenciar Usuários</h2>
                        <p className="text-sm text-[#848E9C]">Total: {users.length} registros</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0B0E11] border border-[#2B3139] text-[#EAECEF] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#8B5CF6] placeholder-[#474D57]"
                        />
                    </div>
                    <Link href="/users/create">
                        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2.5 rounded-lg transition-colors shadow-lg shadow-[#8B5CF6]/20">
                            <Plus size={20} />
                        </button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-[#848E9C] gap-2">
                        <Loader2 className="animate-spin text-[#8B5CF6]" /> Carregando...
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0B0E11] text-[#848E9C] font-bold uppercase text-xs sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Email</th>
                                <th className="px-6 py-4 hidden md:table-cell">Telefone</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2B3139]">
                            {filteredUsers.map((user) => {
                                const hasPhoto = user.photo && user.photo.length > 50 && user.photo !== "default.png";
                                // Garante que temos um ID válido para passar para as funções
                                const userId = user.id!; 
                                return (
                                    <tr key={userId} className="hover:bg-[#2B3139]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#2B3139] border border-[#474D57] flex items-center justify-center text-[#EAECEF] font-bold relative overflow-hidden">
                                                    {hasPhoto ? (
                                                        <Image src={user.photo} alt={user.name} fill className="object-cover" />
                                                    ) : (
                                                        user.name.substring(0, 2).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#EAECEF]">{user.name}</div>
                                                    <div className="text-xs text-[#848E9C] sm:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#EAECEF] hidden sm:table-cell">{user.email}</td>
                                        <td className="px-6 py-4 text-[#EAECEF] hidden md:table-cell">{user.phone || "-"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/users/profile/${userId}`}>
                                                    <button className="p-2 text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B3139] rounded-lg transition-colors">
                                                        <Users size={18} />
                                                    </button>
                                                </Link>
                                                <Link href={`/users/edit/${userId}`}>
                                                    <button className="p-2 text-[#848E9C] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors">
                                                        <Edit size={18} />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => setDeleteId(userId)} 
                                                    className="p-2 text-[#848E9C] hover:text-[#F6465D] hover:bg-[#F6465D]/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Excluir Usuário"
                message="Tem certeza? Esta ação não pode ser desfeita."
                isDestructive={true}
            />
        </div>
    );
};