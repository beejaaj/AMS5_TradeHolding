import { AllUsers } from "@/components/users/AllUsers";
import { Header } from '@/components/common/Header';
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Header />
      <AllUsers />
      <Link href="/currency/">
        <button className="bg-transparent border border-panel text-panel py-2 px-6 rounded-md hover:bg-panel hover:text-white transition duration-200">
          moedas
        </button>
      </Link>
    </div>
  );
}