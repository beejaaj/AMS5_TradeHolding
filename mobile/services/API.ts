import { Platform } from "react-native";

// ⚠️ LÓGICA DE IP:
// Android Emulator: 10.0.2.2 acessa o localhost da sua máquina.
// Web / iOS: localhost funciona direto.
const BASE_GATEWAY_URL = Platform.OS === "android" 
  ? "http://10.0.2.2:5266" 
  : "http://localhost:5266";

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

const crudCurrencyAPI = (basePath: string) => ({
  registerCurrency: () => `${basePath}`,
  getAllCurrency: () => `${basePath}`,
  updateCurrency: (id: string | number) => `${basePath}/${id}`,
  deleteCurrency: (id: string | number) => `${basePath}/${id}`,
  getCurrencyDetails: (id: string | number) => `${basePath}/${id}`,
});

const crhistoryAPI = (basePath: string) => ({
  RegisterHistory: () => `${basePath}`,
  GetByCurrency: (id: string | number) => `${basePath}/${id}`,
  GetRange: (id: string | number) => `${basePath}/${id}/range`,
  DeleteById: (id: string | number) => `${basePath}/${id}`,
});

// --- EXPORTAÇÃO DAS ROTAS ---
export const userAPI = crudAPI(`${BASE_GATEWAY_URL}/user`);
export const currencyAPI = crudCurrencyAPI(`${BASE_GATEWAY_URL}/currency`);
export const historyAPI = crhistoryAPI(`${BASE_GATEWAY_URL}/history`);

export const authAPI = {
  login: () => `${BASE_GATEWAY_URL}/auth/login`,
  profile: () => `${BASE_GATEWAY_URL}/auth/profile`,
  logout: () => `${BASE_GATEWAY_URL}/auth/logout`,
  refreshToken: () => `${BASE_GATEWAY_URL}/auth/refreshtoken`, 
};

export const walletAPI = {
  getWallets: (userId: number | string) => `${BASE_GATEWAY_URL}/wallet/${userId}`,
  create: () => `${BASE_GATEWAY_URL}/wallet/create`,
  deposit: () => `${BASE_GATEWAY_URL}/wallet/deposit`,
  trade: () => `${BASE_GATEWAY_URL}/wallet/trade`,
  transfer: () => `${BASE_GATEWAY_URL}/wallet/transfer`,
  getDetails: (id: number) => `${BASE_GATEWAY_URL}/wallet/details/${id}`,
};

export const chatbotAPI = {
  message: () => `${BASE_GATEWAY_URL}/chatbot`,
};