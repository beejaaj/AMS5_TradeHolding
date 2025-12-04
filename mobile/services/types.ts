export interface Currency {
  id?: number;
  symbol: string;
  name: string;
  description?: string;
  backing: string;
  status: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  value: number; 
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  photo: string;
}