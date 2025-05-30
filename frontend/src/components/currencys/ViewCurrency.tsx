"use client";

import { useEffect, useState } from "react";
import { FaCoins, FaPen, FaTrash } from "react-icons/fa";
import { currencyAPI } from "@/services/API";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./CurrencyProfile.css";

export const CurrencyProfile = ({ params }: { params: { id: string } }) => {
  const [currency, setCurrency] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrency() {
      setLoading(true);
      try {
        const res = await fetch(currencyAPI.getCurrencyDetails(params.id), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erro ao carregar moeda");
        }

        const data = await res.json();
        setCurrency(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar moeda");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrency();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta moeda?")) return;

    setDeleting(true);
    try {
      const res = await fetch(currencyAPI.deleteCurrency(params.id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Erro ao excluir moeda");
      }

      alert("Moeda excluída com sucesso!");
      router.push("/currency");
    } catch (err: any) {
      setError(err.message || "Erro ao excluir moeda");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="currency-profile-container">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p className="loading">Carregando moeda...</p>
      ) : (
        currency && (
          <div className="currency-card">
            <div className="currency-header">
              <FaCoins size={40} className="currency-icon" />
              <h2 className="currency-symbol">{currency.symbol}</h2>
              <span className="currency-name">{currency.name}</span>
            </div>
            <div className="currency-details">
              <p><strong>Descrição:</strong> {currency.description || "Sem descrição"}</p>
              <p><strong>Lastro:</strong> {currency.backing}</p>
              <p><strong>Status:</strong> {currency.status}</p>
            </div>
            <div className="currency-actions">
              <Link href={`/currencys/edit/${params.id}`} className="edit-btn">
                <FaPen /> Editar
              </Link>
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : (<><FaTrash /> Excluir</>)}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
