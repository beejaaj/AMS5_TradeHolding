"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from '@/services/API';
import Link from 'next/link';
import './RegisterForm.css';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const userPayload = { 
        name,
        email,
        phone,
        address,
        password,
        photo: photoUrl
      };
      const res = await fetch(userAPI.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Falha no cadastro');
      }
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => router.push('/users/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container bg-main text-white">
      <div className="login-card">
        <Link href="/" className="back-button">
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
    <label htmlFor="name">Nome</label>
    <input
      id="name"
      type="text"
      placeholder="Seu nome completo"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="form-input"
      required
      autoComplete="name"
    />
  </div>
  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      placeholder="seu@email.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="form-input"
      required
      autoComplete="email"
    />
  </div>
  <div className="form-group">
    <label htmlFor="phone">Telefone</label>
    <input
      id="phone"
      type="tel"
      placeholder="(00) 00000-0000"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="form-input"
      required
      autoComplete="tel"
    />
  </div>
  <div className="form-group">
    <label htmlFor="address">Endereço</label>
    <input
      id="address"
      type="text"
      placeholder="Seu endereço completo"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="form-input"
      required
      autoComplete="street-address"
    />
  </div>
  <div className="form-group">
    <label htmlFor="photo">URL da Foto</label>
    <input
      id="photo"
      type="url"
      placeholder="https://..."
      value={photoUrl}
      onChange={(e) => setPhotoUrl(e.target.value)}
      className="form-input"
      autoComplete="url"
    />
  </div>
  <div className="form-group">
    <label htmlFor="password">Senha</label>
    <input
      id="password"
      type="password"
      placeholder="********"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="form-input"
      required
      autoComplete="new-password"
    />
  </div>
  <div className="form-group">
    <label htmlFor="confirmPassword">Confirmar Senha</label>
    <input
      id="confirmPassword"
      type="password"
      placeholder="********"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="form-input"
      required
      autoComplete="new-password"
    />
  </div>
  <button type="submit" disabled={loading} className="submit-button">
    {loading ? 'Cadastrando...' : 'Cadastrar'}
  </button>
</form>

        <p className="register-link">
          Já tem uma conta?{' '}
          <Link href="/users/login" className="text-panel hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}