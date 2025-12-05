"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    router.push("/users/login");
  };

  const navItems = isLoggedIn ? [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mercado", href: "/currency", icon: ArrowRightLeft },
    { name: "Carteira", href: "/users", icon: Wallet },
  ] : [
    { name: "Mercado", href: "/currency", icon: ArrowRightLeft },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B0E11]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO E NOME */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* Ajuste do Logo: p-0.5 para padding e object-contain */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 p-0.5">
                <Image 
                  src="/Lunaria.jpg" 
                  alt="Lunaria Logo" 
                  fill 
                  className="object-contain rounded-full"
                />
              </div>
              {/* Nome Alterado */}
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                Lunaria
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group relative overflow-hidden
                      ${isActive 
                        ? "text-[#8B5CF6] bg-[#8B5CF6]/10" 
                        : "text-[#848E9C] hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <item.icon size={18} className={isActive ? "text-[#8B5CF6]" : "group-hover:text-[#8B5CF6] transition-colors"} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AREA DO USUÁRIO */}
          <div className="hidden md:block">
             {isLoggedIn ? (
               <div className="relative" ref={dropdownRef}>
                 <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2B3139] border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                 >
                    <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs text-white">
                      <UserIcon size={14} />
                    </div>
                    <span>Minha Conta</span>
                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {isUserMenuOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute right-0 mt-2 w-48 bg-[#1E2329] border border-[#2B3139] rounded-xl shadow-xl overflow-hidden py-1"
                     >
                        <Link href="/users/profile/me" className="flex items-center gap-2 px-4 py-3 text-sm text-[#EAECEF] hover:bg-[#2B3139] hover:text-[#8B5CF6] transition-colors">
                          <UserIcon size={16} /> Perfil
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#F6465D] hover:bg-[#F6465D]/10 transition-colors border-t border-[#2B3139]"
                        >
                          <LogOut size={16} /> Sair
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ) : (
               <Link 
                 href="/users/login" 
                 className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2B3139] border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:border-[#8B5CF6]/50"
               >
                  <LogIn size={16} />
                  Entrar
               </Link>
             )}
          </div>

          {/* MENU MOBILE */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#848E9C] hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B0E11] border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-[#848E9C] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-[#8B5CF6]" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/5 mt-4">
                 {isLoggedIn ? (
                    <>
                      <Link 
                        href="/users/profile/me" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-[#EAECEF] hover:bg-white/5 rounded-lg"
                      >
                         <UserIcon size={20} /> Meu Perfil
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[#F6465D] hover:bg-[#F6465D]/10 rounded-lg mt-2 font-medium"
                      >
                         <LogOut size={20} /> Sair da Conta
                      </button>
                    </>
                 ) : (
                    <Link 
                        href="/users/login" 
                        onClick={() => setIsOpen(false)} 
                        className="w-full flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-3 rounded-lg font-bold"
                    >
                        Entrar na Plataforma
                    </Link>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}