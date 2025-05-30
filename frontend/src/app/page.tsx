"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/NavBar";
import Link from "next/link";
// Evita erro de SSR com Chart.js
const CryptoPieChart = dynamic(() => import("../components/CryptoPieChart"), {
  ssr: false,
});
export default function Home() {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-main text-white px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Bem-vindo à Lunaria
        </h1>
        <p className="text-subtitle text-lg mb-10 text-center max-w-xl">
          Uma nova oportunidade de investimentos para a sua vida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/users/login">
            <button className="bg-panel text-white py-2 px-6 rounded-md hover:bg-purple-800 transition duration-200">
              Login
            </button>
          </Link>
          <Link href="/users/create">
            <button className="bg-transparent border border-panel text-panel py-2 px-6 rounded-md hover:bg-panel hover:text-white transition duration-200">
              Cadastro
            </button>
          </Link>
        </div> */}

         <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-main text-white px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Bem-vindo à Lunaria
        </h1>
        <p className="text-subtitle text-lg mb-10 text-center max-w-xl">
          Uma nova oportunidade de investimentos para a sua vida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/users/login">
            <button className="bg-panel text-white py-2 px-6 rounded-md hover:bg-purple-800 transition duration-200">
              Login
            </button>
          </Link>
          <Link href="/users/create">
            <button className="bg-transparent border border-panel text-panel py-2 px-6 rounded-md hover:bg-panel hover:text-white transition duration-200">
              Cadastro
            </button>
          </Link>
        </div>
        {/* TABELA FICTÍCIA DE CRIPTOMOEDAS */}
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-title mb-4 text-center">
            Mercado de Cripto (Lunaria)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-highlight">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-panel text-title">
                <tr>
                  <th className="px-4 py-3">Par</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">24h %</th>
                  <th className="px-4 py-3">Volume</th>
                </tr>
              </thead>
              <tbody className="bg-main text-subtitle">
                <tr className="border-t border-highlight hover:bg-[#1a1a1a] transition">
                  <td className="px-4 py-2">BTC/USDT</td>
                  <td className="px-4 py-2 text-title">$63,200.12</td>
                  <td className="px-4 py-2 text-green-400">+2.15%</td>
                  <td className="px-4 py-2">$1.5B</td>
                </tr>
                <tr className="border-t border-highlight hover:bg-[#1a1a1a] transition">
                  <td className="px-4 py-2">ETH/USDT</td>
                  <td className="px-4 py-2 text-title">$3,420.89</td>
                  <td className="px-4 py-2 text-red-400">-1.02%</td>
                  <td className="px-4 py-2">$800M</td>
                </tr>
                <tr className="border-t border-highlight hover:bg-[#1a1a1a] transition">
                  <td className="px-4 py-2">XRP/USDT</td>
                  <td className="px-4 py-2 text-title">$0.5210</td>
                  <td className="px-4 py-2 text-green-400">+0.67%</td>
                  <td className="px-4 py-2">$180M</td>
                </tr>
                <tr className="border-t border-highlight hover:bg-[#1a1a1a] transition">
                  <td className="px-4 py-2">ADA/USDT</td>
                  <td className="px-4 py-2 text-title">$0.4012</td>
                  <td className="px-4 py-2 text-red-400">-0.34%</td>
                  <td className="px-4 py-2">$95M</td>
                </tr>
                <tr className="border-t border-highlight hover:bg-[#1a1a1a] transition">
                  <td className="px-4 py-2">DOGE/USDT</td>
                  <td className="px-4 py-2 text-title">$0.0831</td>
                  <td className="px-4 py-2 text-green-400">+4.88%</td>
                  <td className="px-4 py-2">$300M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Gráfico redondo */}
        <CryptoPieChart />
      </div>
    </>
  );
}
