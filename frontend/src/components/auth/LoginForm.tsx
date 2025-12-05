"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/userService";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import "./LoginForm.css";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await login({ email, password });
      setSuccess("Login realizado com sucesso!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Credenciais inválidas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <Link href="/" className="back-button" aria-label="Voltar para Home">
          <ArrowLeft size={24} />
        </Link>

        <div className="login-header">
          {/* Logo Envolvido em Container para ajuste perfeito */}
          <div className="login-logo-container">
             <img src="/Lunaria.jpg" alt="Lunaria Logo" className="login-logo-img" />
          </div>
          <h2 className="login-title">Entrar na Conta</h2>
          <p className="login-subtitle">Bem-vindo de volta à Lunaria</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="message-box error-message"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="message-box success-message"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Link href="/forgot-password" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Entrar <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div className="register-link">
          Ainda não tem conta?
          <Link href="/users/create">
            Registre-se grátis
          </Link>
        </div>
      </motion.div>
    </div>
  );
};