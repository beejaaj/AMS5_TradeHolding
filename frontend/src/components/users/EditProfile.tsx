"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "@/services/API";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import "./EditProfile.css";
import { User } from "@/services/userService";

export const EditProfile = ({ params }: { params: { id: string } }) => {
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        photo: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(userAPI.getById(params.id), {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });
                if (!res.ok) {
                    if (res.status === 401)
                        throw new Error("Sessão expirada. Faça login novamente.");
                    throw new Error("Erro ao buscar usuário");
                }
                const data = await res.json();
                setUser({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    photo: data.photo,
                    password: "",
                });
            } catch (err: any) {
                setError(err.message);
                if (err.message.includes("Sessão")) router.push("/login");
            }
        }
        fetchUser();
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(userAPI.edit(params.id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(user),
            });
            if (!res.ok) {
                if (res.status === 401)
                    throw new Error("Sessão expirada. Faça login novamente.");
                throw new Error("Erro ao atualizar usuário");
            }
            setSuccess("Usuário atualizado com sucesso!");
            router.push(`/users/profile/${params.id}`);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes("Sessão")) router.push("/users/login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <Link href="/users" className="back-button">
                    <button
                        type="button"
                        aria-label="Voltar para listagem"
                        className="back-button-inner"
                    >
                        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </Link>
                <h1 className="edit-profile-title">Editar Perfil</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <FaUserAlt size={24} className="profile-avatar" />
                <input
                    type="text"
                    name="photo"
                    placeholder="URL da foto..."
                    value={user.photo}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Telefone"
                    value={user.phone}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Endereço"
                    value={user.address}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite sua nova senha"
                    value={user.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </div>
    );
};
