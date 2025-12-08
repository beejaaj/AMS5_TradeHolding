export interface Currency {
  id?: number;
  symbol: string;
  name: string;
  description?: string;
  backing: string;
  status: string;
}

export interface History {
  id: number;
  currencyId: string;
  date: string;
  value: number; 
}
