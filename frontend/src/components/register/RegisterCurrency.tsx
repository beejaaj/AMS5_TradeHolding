"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { currencyAPI } from '@/services/API';
import Link from 'next/link';
import './RegisterForm.css';

export default function RegisterForm() {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [backing, setBacking] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const currencyPayload = {
        symbol,
        name,
        description,
        backing,
        status
      };
      const res = await fetch(currencyAPI.registerCurrency(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currencyPayload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Falha no cadastro');
      }
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => router.push('/currency'), 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar moeda.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container bg-main text-white">
      <div className="login-card">
        <Link href="/currency" className="back-button">
          <button aria-label="Voltar para home" className="back-button-inner">
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Link>
        <h1 className="login-title">Cadastro</h1>
        <h1 className="login-title">
          <img src="/Lunaria.jpg" alt="Logo" className="login-logo" />
        </h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="symbol">Símbolo</label>
            <input
              id="symbol"
              type="text"
              placeholder="₿"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Nome da moeda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input
              id="description"
              type="text"
              placeholder="Breve descrição da sua moeda"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="backing">Lastro</label>
            <input
              id="backing"
              type="text"
              placeholder="Dolar:"
              value={backing}
              onChange={(e) => setBacking(e.target.value)}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Selecione o status:</option>
              <option value="ativo">Ativo</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}