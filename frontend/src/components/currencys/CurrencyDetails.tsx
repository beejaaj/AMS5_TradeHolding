"use client";

import React, { useState } from "react";
import { FaCoins, FaPen, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Currency } from "../../services/types";
import { currencyAPI } from "@/services/API";
import "./CurrencyDetails.css";

export const CurrencyDetails = ({
  currency,
}: {
  currency: Currency | null;
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!currency) return;
    if (
      !window.confirm("Tem certeza que deseja excluir esta moeda?")
    )
      return;

    setDeleting(true);
    setError("");
    try {
      const res = await fetch(
        currencyAPI.deleteCurrency(currency.id!),
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Erro ao excluir moeda");
      }
      alert("Moeda excluída com sucesso!");
      // Atualiza a página inteira
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir moeda");
    } finally {
      setDeleting(false);
    }
  };

  if (!currency) {
    return (
      <div className="currency-placeholder">
        Para ver os detalhes de uma moeda, selecione uma na lista da esquerda
      </div>
    );
  }

  return (
    <div className="currency-profile-container">
      {error && <div className="error-message">{error}</div>}

      <div className="currency-card">
        <div className="currency-header">
          <FaCoins size={40} className="currency-icon" />
          <h2 className="currency-symbol">{currency.symbol}</h2>
          <span className="currency-name">{currency.name}</span>
        </div>

        <div className="currency-details">
          <p>
            <strong>Descrição:</strong>{" "}
            {currency.description || "Sem descrição"}
          </p>
          <p>
            <strong>Lastro:</strong> {currency.backing}
          </p>
          <p>
            <strong>Status:</strong> {currency.status}
          </p>
        </div>
      </div>
    </div>
  );
};
