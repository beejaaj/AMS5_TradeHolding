export interface Currency {
  id?: number | string;
  symbol: string;
  name: string;
  description?: string;
  backing: string;
  status: string;
  reverse?: boolean; // Adicionado conforme sua última versão
}

export interface History {
  id: string;
  currencyId: string;
  date: string;
  value: number; 
}

export interface User {
  id?: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  photo: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

// --- Wallet Types ---
export interface Wallet {
  id: number;
  userId: number;
  name: string;
  currency: string;
  balance: number;
}

export interface CreateWalletDto {
  userId: number;
  name: string;
  currency: string;
}

export interface DepositDto {
  walletId: number;
  amount: number;
}

export interface TradeDto {
  userId: number;
  fromWalletId: number;
  toCurrency: string;
  amount: number;
}

export interface TransferDto {
    fromWalletId: number;
    toEmail: string;
    amount: number;
}