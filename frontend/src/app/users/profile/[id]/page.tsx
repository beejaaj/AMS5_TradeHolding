"use client";

import { UserProfile } from "@/components/users/UserProfile";
import { Header } from '@/components/common/Header';

type ProfilePageProps = {
  params: { id: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div>
      <Header />
      <UserProfile params={params} />
    </div>
  );
}