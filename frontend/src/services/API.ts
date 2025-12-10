//const BASE_GATEWAY_URL = "http://localhost:5266";
const BASE_GATEWAY_URL = "https://fuzzy-spork-v6pp6ggx7w752wr7g-5266.app.github.dev";

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

// Rotas Base (Conforme Ocelot UpstreamPathTemplate)
const userAPI = crudAPI(`${BASE_GATEWAY_URL}/user`);
const currencyAPI = crudCurrencyAPI(`${BASE_GATEWAY_URL}/currency`);
const historyAPI = crhistoryAPI(`${BASE_GATEWAY_URL}/history`);

const authAPI = {
  login: () => `${BASE_GATEWAY_URL}/auth/login`,
  profile: () => `${BASE_GATEWAY_URL}/auth/profile`,
  logout: () => `${BASE_GATEWAY_URL}/auth/logout`,
  refreshToken: () => `${BASE_GATEWAY_URL}/auth/refreshtoken`,
};

// ✅ CORREÇÃO: Rotas da Wallet alinhadas com o ocelot.json (/wallet e não /api/wallet)
const walletAPI = {
    getWallets: (userId: number | string) => `${BASE_GATEWAY_URL}/wallet/${userId}`,
    create: () => `${BASE_GATEWAY_URL}/wallet/create`,
    deposit: () => `${BASE_GATEWAY_URL}/wallet/deposit`,
    trade: () => `${BASE_GATEWAY_URL}/wallet/trade`,
};

// Rota do Chatbot via Gateway
const chatbotAPI = {
    message: () => `${BASE_GATEWAY_URL}/chatbot`,
};

export { userAPI, authAPI, currencyAPI, historyAPI, walletAPI, chatbotAPI };