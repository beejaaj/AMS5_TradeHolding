import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Wallet",
  description: "Gerenciador de Carteiras de Criptomoedas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthGuard>
            {children}
        </AuthGuard>
        <ChatWidget />
      </body>
    </html>
  );
}