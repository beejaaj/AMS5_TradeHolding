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
