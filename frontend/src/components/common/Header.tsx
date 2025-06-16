'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-transparent border-b border-white text-white shadow-md w-full z-10">
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
          <Link href="/" className="hover:text-gray-300 transition">
            Início
          </Link>
          <Link href="/market" className="hover:text-gray-300 transition">
            Mercado
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contato
          </Link>
        </div>

        {/* Botão de login */}
        <Link href="/users/login">
          <button className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition hidden md:inline-block">
            Entrar
          </button>
        </Link>

        {/* Botão mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden px-4 pb-4 bg-black/80 text-white flex flex-col gap-4">
          <Link href="/" className="hover:text-gray-300 transition">
            Início
          </Link>
          <Link href="/market" className="hover:text-gray-300 transition">
            Mercado
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contato
          </Link>
          <Link href="/users/login">
            <button className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition w-full">
              Entrar
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};
