import { AllUsers } from "@/components/users/AllUsers";
import NavBar from "@/components/NavBar";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <NavBar />

      {/* Adicionado pt-20 para o conteúdo não ficar atrás da navbar fixa */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AllUsers />
      </main>
    </div>
  );
}