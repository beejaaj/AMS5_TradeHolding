import { AllUsers } from "@/components/users/AllUsers";
import { Header } from '@/components/common/Header';
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Header />
      <AllUsers />
    </div>
  );
}