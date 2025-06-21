"use client";

import React from "react";
import { HistoryItem } from "../../services/types";
import "./CurrencyHistory.css";

export const CurrencyHistory = ({
    history,
    loading,
}: {
    history: HistoryItem[];
    loading: boolean;
}) => {
    if (loading) {
        return <p className="loading-history">Carregando histórico...</p>;
    }

    if (history.length === 0) {
        return (
            <div className="history-container">
                <p className="no-history">
                    Esta moeda não possui histórico ainda! Adicione um através do botão
                    acima.
                </p>
            </div>
        );
    }

    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="history-container">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Data e Hora</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedHistory.map((item, index) => {
                        const nextItem = sortedHistory[index + 1];
                        let className = "history-value-neutral";
                        let arrow = "";

                        if (nextItem) {
                            if (item.value > nextItem.value) {
                                className = "history-value-up";
                                arrow = "▲";
                            } else if (item.value < nextItem.value) {
                                className = "history-value-down";
                                arrow = "▼";
                            }
                        } else {
                            className = "history-value-neutral";
                            arrow = "";
                        }

                        return (
                            <tr key={item.id}>
                                <td className="history-date">
                                    {new Date(item.date).toLocaleString("pt-BR", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    })}
                                </td>
                                <td className={className}>
                                    {arrow}{" "}
                                    {item.value.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
