"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { historyAPI } from "@/services/API";
import "./RegisterHistory.css";

export default function RegisterHistory() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currencyIdParam = searchParams.get("currencyId") || "";
    const [currencyId, setCurrencyId] = useState<string>(currencyIdParam);

    const [usePcDate, setUsePcDate] = useState(false);
    const [dateValue, setDateValue] = useState("");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usePcDate) {
            const now = new Date();
            const iso = now.toISOString().slice(0, 16);
            setDateValue(iso);
        }
    }, [usePcDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!currencyId) {
            setError("ID da moeda não fornecido.");
            setLoading(false);
            return;
        }
        if (!dateValue) {
            setError("Preencha a data ou selecione usar data do PC.");
            setLoading(false);
            return;
        }
        if (!value) {
            setError("Preencha o valor do histórico.");
            setLoading(false);
            return;
        }

        const payload = {
            currencyId: currencyId,
            value: parseFloat(value),
            date: new Date(dateValue).toISOString(),
        };

        try {
            const res = await fetch(historyAPI.RegisterHistory(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let errMsg = "Falha ao cadastrar histórico.";
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    errMsg = json.message || text;
                } catch {
                    errMsg = text;
                }
                throw new Error(errMsg);
            }

            setSuccess("Histórico cadastrado com sucesso!");
            setTimeout(() => {
                router.push(`/currency`);
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Erro inesperado ao cadastrar histórico.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-history-container">
            <div className="register-history-card">
                <h1 className="register-history-title">Novo Histórico</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="register-history-form">
                    <div className="form-group">
                        <label>ID da Moeda</label>
                        <input
                            type="text"
                            value={currencyId}
                            disabled
                            className="form-input read-only-input disabled-input"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="date">Data e hora</label>
                        <input
                            id="date"
                            type="datetime-local"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                            disabled={usePcDate}
                            className="form-input disabled-input"
                            required={!usePcDate}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="value">Valor</label>
                        <input
                            id="value"
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="form-input"
                            placeholder="Ex: 123.45"
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="usePcDate"
                            checked={usePcDate}
                            onChange={(e) => setUsePcDate(e.target.checked)}
                        />
                        <label htmlFor="usePcDate">Usar data/hora do PC</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-history-btn "
                    >
                        {loading ? "Cadastrando..." : "Cadastrar Histórico"}
                    </button>
                </form>
            </div>
        </div>
    );
}
