import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-main text-white px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Bem-vindo à Lunaria
        </h1>
        <p className="text-subtitle text-lg mb-10 text-center max-w-xl">
          Uma nova oportunidade de investimentos para a sua vida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </>
  );
}
