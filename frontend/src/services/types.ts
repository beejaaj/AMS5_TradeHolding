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
