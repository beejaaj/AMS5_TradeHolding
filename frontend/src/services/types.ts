export interface Currency {
  id?: string;
  symbol: string;
  name: string;
  description?: string;
  backing: string;
  status: string;
}

export interface History {
  id: string;
  currencyId: string;
  date: string;
  value: number;
}

export interface Wallet {
  id: number;
  userId: number;
  name: string;
  currencySymbol: string;
  balance: number;
}

export interface CreateWalletDto {
  userId: number;
  name: string;
  currency: string;
}

export interface DepositDto {
  userId: number;
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
    userId: number;
    fromWalletId: number;
    toWalletId: number;
    amount: number;
}

export interface Transaction {
    id: number;
    type: string;
    description: string;
    amount: number;
    currencySymbol: string;
}