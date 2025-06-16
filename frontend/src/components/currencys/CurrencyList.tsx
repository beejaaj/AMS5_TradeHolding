"use client";

import React, { useEffect, useState } from "react";
import { currencyAPI } from "@/services/API";
import { Currency } from "../../services/types";
import Link from "next/link";
import "./CurrencyList.css";
import { useRouter } from "next/navigation";

export const CurrencyList = ({
    onSelect,
}: {
    onSelect: (currency: Currency) => void;
}) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchCurrencies();
    }, []);

    async function fetchCurrencies() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(currencyAPI.getAllCurrency(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Falha ao carregar as moedas");
            const data = await res.json();
            setCurrencies(data);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar a lista de moedas.");
        } finally {
            setLoading(false);
        }
    }

    const handleClick = (currency: Currency) => {
        setSelectedId(currency.id!);
        onSelect(currency);
        setMenuOpenId(null); // Fecha menu ao selecionar
    };

    const toggleMenu = (id: number) => {
        setMenuOpenId((prevId) => (prevId === id ? null : id));
    };

    const handleEdit = (id: number) => {
        setMenuOpenId(null);
        router.push(`/currency/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        const currencyToDelete = currencies.find((c) => c.id === id);
        if (!currencyToDelete) return;
        if (!window.confirm("Tem certeza que deseja excluir esta moeda?")) return;

        setDeleting(true);
        setError("");
        try {
            const res = await fetch(currencyAPI.deleteCurrency(id), {
                method: "DELETE",
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Erro ao excluir moeda");
            }
            alert("Moeda excluída com sucesso!");

            // Se a moeda excluída estava selecionada, limpa a seleção
            if (selectedId === id) {
                setSelectedId(null);
                onSelect(null as any); // cast pq onSelect espera Currency, mas null é ok aqui
            }
            await fetchCurrencies();
        } catch (err: any) {
            setError(err.message || "Erro ao excluir moeda");
        } finally {
            setDeleting(false);
            setMenuOpenId(null);
        }
    };

    return (
        <div className="currency-list-container">
            <div className="list-header">
                <h2>Moedas</h2>
                <Link href="/currency/create">
                    <button className="btn btn-currency btn-add">
                        <span>+ Nova Moeda</span>
                    </button>
                </Link>
            </div>

            {loading ? (
                <p className="loading">Carregando moedas...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <ul className="currency-items">
                    {currencies.length === 0 && (
                        <li className="no-currency">Nenhuma moeda cadastrada.</li>
                    )}
                    {currencies.map((c) => (
                        <li
                            key={c.id}
                            className={`item ${selectedId === c.id ? "selected" : ""}`}
                            onClick={() => handleClick(c)}
                        >
                            <div className="currency-info">
                                <span className="symbol">{c.symbol}</span>
                                <span className="name">{c.name}</span>
                            </div>
                            <div
                                className="menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMenu(c.id!);
                                }}
                            >
                                ⋮
                                {menuOpenId === c.id && (
                                    <div
                                        className="dropdown-menu"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div
                                            className="dropdown-item"
                                            onClick={() => handleEdit(c.id!)}
                                        >
                                            Editar
                                        </div>
                                        <div
                                            className="dropdown-item delete"
                                            onClick={() => handleDelete(c.id!)}
                                        >
                                            {deleting ? "Excluindo..." : "Excluir"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
