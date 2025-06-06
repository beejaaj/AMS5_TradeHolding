// components/CurrencyList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { currencyAPI } from "@/services/API";
import { Currency } from "../../services/types";
import Link from "next/link";
import "./CurrencyList.css";

export const CurrencyList = ({
    onSelect,
}: {
    onSelect: (currency: Currency) => void;
}) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);

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
    };

    return (
        <div className="currency-list-container">
            <div className="list-header">
                <h2>Moedas</h2>
                <Link href="/currency/create">
                    <button
                        className="btn btn-currency btn-add"
                    >
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
                            className={selectedId === c.id ? "item selected" : "item"}
                            onClick={() => handleClick(c)}
                        >
                            <span className="symbol">{c.symbol}</span>
                            <span className="name">{c.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
