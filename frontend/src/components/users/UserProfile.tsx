"use client";

import { useEffect, useState } from "react";
import { FaPen, FaTrash, FaUserAlt } from 'react-icons/fa';
import { userAPI } from "@/services/API";
import Link from "next/link";
import { useRouter } from "next/navigation";
import './UserProfile.css';

export const UserProfile = ({ params }: { params: { id: string } }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchUserProfile() {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(userAPI.getById(params.id), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (!res.ok) {
                    console.error('Erro ao buscar perfil:', res.status, await res.text());
                    throw new Error(`Falha ao carregar o perfil (status ${res.status})`);
                }

                const data = await res.json();
                setUser(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro ao carregar o perfil do usuário');
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [params.id]);

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(userAPI.delete(params.id), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                let message = 'Erro ao excluir usuário';
                try {
                    const data = await res.json();
                    message = data.message || message;
                } catch (e) {

                }
                throw new Error(message);
            }

            alert('Usuário excluído com sucesso!');
            router.push('/users');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao excluir usuário');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <Link href="/users" className="back-button">
                    <button aria-label="Voltar para home" className="back-button-inner">
                        <svg className="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </Link>
                <h1 className="profile-title">Perfil de {user?.name}</h1>
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                    <p className="loading">Carregando...</p>
                ) : (
                    <div className="profile-card">
                        <div className="profile-info">
                            <FaUserAlt size={24} className="profile-avatar" />
                            <div className="profile-details">
                                <p><strong>Nome:</strong> {user?.name}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Telefone:</strong> {user?.phone}</p>
                                <p><strong>Endereço:</strong> {user?.address || 'Não informado'}</p>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <Link href={`/users/edit/${params.id}`} className="edit-btn">
                                <FaPen /> Editar
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="delete-btn"
                                disabled={deleting}
                            >
                                {deleting ? 'Excluindo...' : (<><FaTrash /> Excluir</>)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
