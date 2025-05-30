// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-panel text-title shadow-md w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">Lunaria</span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-subtitle transition">
            Início
          </Link>
          <Link href="/market" className="hover:text-subtitle transition">
            Mercado
          </Link>
          <Link href="/about" className="hover:text-subtitle transition">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-subtitle transition">
            Contato
          </Link>
        </div>

        {/* Botão de login */}
        <Link href="/users/login">
          <button className="bg-white text-panel px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition hidden md:inline-block">
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
        <div className="md:hidden px-4 pb-4 bg-panel text-title flex flex-col gap-4">
          <Link href="/" className="hover:text-subtitle transition">
            Início
          </Link>
          <Link href="/market" className="hover:text-subtitle transition">
            Mercado
          </Link>
          <Link href="/about" className="hover:text-subtitle transition">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-subtitle transition">
            Contato
          </Link>
          <Link href="/users/login">
            <button className="bg-white text-panel px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition w-full">
              Entrar
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
