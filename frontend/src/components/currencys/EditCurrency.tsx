"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currencyAPI } from "@/services/API";
import "./EditCurrency.css";
import Link from 'next/link';
import { Currency } from "@/services/currencyService";

export const EditCurrency = ({ params }: { params: { id: string } }) => {
    const [currency, setCurrency] = useState<Currency>({
        symbol: "",
        name: "",
        description: "",
        backing: "",
        status: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchCurrency() {
            try {
                const res = await fetch(currencyAPI.getCurrencyDetails(params.id));
                if (!res.ok) throw new Error("Erro ao buscar moeda");
                const data = await res.json();
                setCurrency({
                    symbol: data.symbol,
                    name: data.name,
                    description: data.description,
                    backing: data.backing,
                    status: data.status.toLowerCase(), 
                });
            } catch (err: any) {
                setError(err.message);
            }
        }
        fetchCurrency();
    }, [params.id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCurrency({ ...currency, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(currencyAPI.updateCurrency(params.id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currency),
            });
            if (!res.ok) throw new Error("Erro ao atualizar moeda!");
            setSuccess("Moeda atualizada com sucesso!");
            router.push(`/currency/edit/${params.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <Link href="/currency" className="back-button">
                    <button aria-label="Voltar para home" className="back-button-inner">
                        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </Link>
                <h1 className="edit-profile-title">Atualizar moeda</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="symbol">Símbolo</label>
                    <input
                        type="text"
                        name="symbol"
                        placeholder="Símbolo"
                        value={currency.symbol}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nome</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={currency.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descrição</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={currency.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="backing">Lastro</label>
                    <input
                        type="text"
                        name="backing"
                        placeholder="Lastro"
                        value={currency.backing}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={currency.status}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">Selecione o status:</option>
                        <option value="ativo">Ativo</option>
                        <option value="fechado">Fechado</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </div>
    );
};
