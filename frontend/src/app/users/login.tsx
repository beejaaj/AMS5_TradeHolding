// pages/login.tsx
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4">
      <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-subtitle font-medium mb-1">Email</label>
            <input
              type="email"
              className="form-input w-full p-3 rounded-md border border-highlight bg-transparent text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-subtitle font-medium mb-1">Senha</label>
            <input
              type="password"
              className="form-input w-full p-3 rounded-md border border-highlight bg-transparent text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-panel text-white py-2 rounded-md hover:bg-purple-800 transition duration-200"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-subtitle mt-4 text-center">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-panel hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}