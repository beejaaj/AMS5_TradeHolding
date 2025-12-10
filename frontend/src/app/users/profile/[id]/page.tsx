"use client";

import { UserProfile } from "@/components/users/UserProfile";
import NavBar from "@/components/NavBar";

type ProfilePageProps = {
  params: { id: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-[#0B0E11] pt-20">
      <NavBar />
      <UserProfile id={params.id} />
    </div>
  );
}