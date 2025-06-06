// components/CurrencyDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CurrencyList } from "./CurrencyList";
import { CurrencyDetails } from "./CurrencyDetails";
import { CurrencyHistory } from "./CurrencyHistory";
import { Currency, HistoryItem } from "../../services/types";
import { currencyAPI, historyAPI } from "@/services/API";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "./CurrencyDashboard.css";

export const CurrencyDashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (selectedCurrency) {
      fetchHistory(selectedCurrency.id!);
    } else {
      setHistory([]);
      setLoadingHistory(false);
      setError("");
    }
  }, [selectedCurrency]);

  async function fetchHistory(currencyId: number) {
    setLoadingHistory(true);
    setError("");
    try {
      const res = await fetch(historyAPI.GetByCurrency(currencyId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Falha ao carregar histórico");

      const data = await res.json();
      console.log("Resposta da API de histórico:", data);
      const lista: HistoryItem[] = Array.isArray(data) ? data : [];
      setHistory(lista);
    } catch (err: any) {
      console.error("Erro ao buscar histórico:", err);
      setError(err.message || "Erro ao carregar histórico");
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <CurrencyList onSelect={(c) => setSelectedCurrency(c)} />
      </aside>

      <div className="main-card">
        <div className="upper-section">
          <CurrencyDetails currency={selectedCurrency} />
        </div>

        {selectedCurrency && (
          <div className="lower-section">
            <div className="history-header">
              <h3>Histórico</h3>
              <button
                className="btn btn-history btn-add-history"
                onClick={() =>
                  router.push(
                    `/currency/history/create?currencyId=${selectedCurrency.id}`
                  )
                }
              >
                <FaPlus />
                <span>Novo Histórico</span>
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <CurrencyHistory history={history} loading={loadingHistory} />
          </div>
        )}
      </div>
    </div>
  );
};
