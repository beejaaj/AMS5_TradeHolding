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
    currencySymbol: string;
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