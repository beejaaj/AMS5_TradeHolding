"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Settings } from 'lucide-react';

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLogged(false);
    window.location.href = '/users/login';
  };

  return (
    <nav className="bg-transparent border-b border-white text-white shadow-md w-full z-10 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo com imagem */}
        <Link href="/" className="flex items-center">
          <img
            src="/Lunaria.jpg"
            alt="Logo da Lunaria"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-gray-300 transition">Início</Link>
          <Link href="/currency" className="hover:text-gray-300 transition">Moedas</Link>
          <Link href="/users" className="hover:text-gray-300 transition">Usuários</Link>
        </div>

        <div className="relative flex items-center gap-4" ref={menuRef}>
          {isLogged ? (
            <>
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="hidden md:inline-block text-white"
              >
                <Settings size={24} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-800 text-white rounded-md shadow-lg py-2">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/users/login">
              <button className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition hidden md:inline-block">
                Entrar
              </button>
            </Link>
          )}
        </div>

        {/* Botão mobile */}
        <button onClick={() => setMobileOpen(prev => !prev)} className="md:hidden text-white">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 bg-black/80 text-white flex flex-col gap-4">
          <Link href="/" className="hover:text-gray-300 transition">Início</Link>
          <Link href="/currency" className="hover:text-gray-300 transition">Moedas</Link>
          <Link href="/users" className="hover:text-gray-300 transition">Usuários</Link>
          {isLogged ? (
            <button onClick={logout} className="text-red-600 text-left">Logout</button>
          ) : (
            <Link href="/users/login">
              <button className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition w-full">
                Entrar
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
