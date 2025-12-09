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
  ChevronDown,
  Users
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import userService from "@/services/userService"; 

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null); // ✅ Novo estado para a foto
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
        loadUserData(); // Renomeei para ficar mais claro que carrega tudo
    }
  }, [pathname]);

  const loadUserData = async () => {
      try {
          const user = await userService.getProfile();
          const userId = String(user.id);
          
          setCurrentUserId(userId);

          // ✅ Verifica e seta a foto do usuário
          if (user.photo && user.photo.length > 50 && user.photo !== "default.png") {
              setUserPhoto(user.photo);
          } else {
              setUserPhoto(null);
          }

          if (userId === "31" || userId === "32") {
              setIsAdmin(true);
          } else {
              setIsAdmin(false);
          }
      } catch (error) {
          console.error("Erro ao carregar dados do usuário", error);
      }
  };

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
    setIsAdmin(false);
    setCurrentUserId(null);
    setUserPhoto(null);
    setIsUserMenuOpen(false);
    router.push("/users/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, visible: isLoggedIn },
    { name: "Mercado", href: "/currency", icon: ArrowRightLeft, visible: true },
    { name: "Minhas Carteiras", href: "/wallets", icon: Wallet, visible: isLoggedIn },
    { name: "Usuários", href: "/users", icon: Users, visible: isLoggedIn && isAdmin }, 
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B0E11]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-white/5 p-1">
                <Image 
                  src="/Lunaria.jpg" 
                  alt="Lunaria Logo" 
                  fill 
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                Lunaria
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                if (!item.visible) return null;
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

          <div className="hidden md:block">
             {isLoggedIn ? (
               <div className="relative" ref={dropdownRef}>
                 <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2B3139] border border-white/10 text-white px-2 py-1.5 pr-4 rounded-full text-sm font-semibold transition-all group"
                 >
                    {/* ✅ ÁREA DA FOTO DO USUÁRIO */}
                    <div className="w-8 h-8 rounded-full bg-[#2B3139] border border-[#8B5CF6]/30 flex items-center justify-center text-xs text-white overflow-hidden relative shadow-lg group-hover:border-[#8B5CF6] transition-colors">
                      {userPhoto ? (
                        <Image 
                          src={userPhoto} 
                          alt="User" 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <UserIcon size={16} className="text-[#8B5CF6]" />
                      )}
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
                        <Link 
                          href={currentUserId ? `/users/profile/${currentUserId}` : "/users/profile/me"} 
                          className="flex items-center gap-2 px-4 py-3 text-sm text-[#EAECEF] hover:bg-[#2B3139] hover:text-[#8B5CF6] transition-colors"
                        >
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
              {navItems.map((item) => {
                if (!item.visible) return null;
                return (
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
                );
              })}
              
              <div className="pt-4 border-t border-white/5 mt-4">
                 {isLoggedIn ? (
                   <>
                     <Link 
                       href={currentUserId ? `/users/profile/${currentUserId}` : "/users/profile/me"} 
                       onClick={() => setIsOpen(false)}
                       className="flex items-center gap-2 px-4 py-3 text-[#EAECEF] hover:bg-white/5 rounded-lg"
                     >
                        {/* FOTO TAMBÉM NO MOBILE */}
                        <div className="w-6 h-6 rounded-full bg-[#2B3139] border border-[#8B5CF6]/30 flex items-center justify-center overflow-hidden relative">
                          {userPhoto ? (
                            <Image src={userPhoto} alt="User" fill className="object-cover" />
                          ) : (
                            <UserIcon size={14} className="text-[#8B5CF6]" />
                          )}
                        </div>
                        Meu Perfil
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