"use client";

import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { userAPI } from "@/services/API";
import Link from "next/link";
import './AllUsers.css';

export const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await fetch(userAPI.getAll(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error('Falha ao carregar os usuários');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar a lista de usuários.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        setDeletingId(userId);
        try {
            const response = await fetch(userAPI.delete(userId), {

                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao excluir usuário');
            }

            setUsers(users.filter((user: any) => user.id !== userId));

            alert('Usuário excluído com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir usuário:', error);
            setError(error.message || 'Erro ao excluir usuário');
            await fetchUsers();
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="users-container">
            <h1 className="page-title">Lista de Usuários</h1>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <p className="loading">Carregando...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td className="actions">
                                    <Link href={`/users/profile/${user.id}`} className="view-btn">
                                        <FaEye />
                                    </Link>
                                    <Link href={`/users/edit/${user.id}`} className="update-btn">
                                        <FaPen />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="delete-btn"
                                        disabled={deletingId === user.id}
                                    >
                                        {deletingId === user.id ? (
                                            <span className="spinner"></span>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>


    );
};