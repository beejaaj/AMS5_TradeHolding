"use client";

import { ViewCurrency } from "@/components/currencys/ViewCurrency";
import { Header } from '@/components/common/Header';

type ProfilePageProps = {
  params: { id: string };
};

export default function CurrencyDetailsPage({ params }: ProfilePageProps) {
  return (
    <div>
      <Header />
      <ViewCurrency params={params} />
    </div>
  );
}