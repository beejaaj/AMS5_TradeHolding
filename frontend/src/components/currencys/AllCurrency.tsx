"use client";

import { useEffect, useState } from "react";
import { currencyAPI } from "@/services/API";
import Link from "next/link";
import './AllCurrency.css';

export const AllCurrency = () => {
    const [currency, setCurrency] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    async function fetchCurrencies() {
        setLoading(true);
        try {
            const res = await fetch(currencyAPI.getAllCurrency(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error('Falha ao carregar as moedas');
            const data = await res.json();
            setCurrency(data);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar a lista de moedas.');
        } finally {
            setLoading(false);
        }
    }

    // const handleDelete = async (currencyId: number) => {
    //     if (!window.confirm('Tem certeza que deseja excluir esta moeda?')) {
    //         return;
    //     }

    //     setDeletingId(currencyId);
    //     try {
    //         const response = await fetch(currencyAPI.delete(currencyId), {

    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Falha ao excluir moeda');
    //         }

    //         setCurrency(currency.filter((currency: any) => currency.id !== currencyId));
            
    //         alert('Moeda excluída com sucesso!');
    //     } catch (error: any) {
    //         setError(error.message || 'Erro ao excluir moeda');
    //         await fetchCurrencys();
    //     } finally {
    //         setDeletingId(null);
    //     }
    // };

    return (
        <div className="currencys-container">
            <h1 className="page-title">Lista de Moedas</h1>
            <Link href="/currency/create">
                <button className="create-btn">Criar nova moeda</button>
            </Link>
            {loading ? (
                <p className="loading">Carregando...</p>
            ) : (
                <table className="currencys-table">
                    <thead>
                        <tr>
                            <th>Símbolo</th>
                            <th>Nome</th>
                            <th>Lastro</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currency.map((currency: any) => (
                            <tr key={currency.id}>
                                <td>
                                    <Link href={`/currency/view/${currency.id}`} className="view-btn">
                                        {currency.symbol}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`/currency/view/${currency.id}`} className="view-btn">
                                        {currency.name}
                                    </Link>
                                </td>
                                <td>{currency.backing}</td>
                                <td>{currency.status}</td>
                                {/* <td className="actions">
                                    <Link href={`/currencys/edit/${currency.id}`} className="update-btn">
                                        <FaPen />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(currency.id)}
                                        className="delete-btn"
                                        disabled={deletingId === currency.id}
                                    >
                                        {deletingId === currency.id ? (
                                            <span className="spinner"></span>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {error && <div className="error-message">{error}</div>}
            {!loading && currency.length === 0 && (
                <p className="loading">Nenhuma moeda encontrada.</p>
            )}
        </div>
    );
};