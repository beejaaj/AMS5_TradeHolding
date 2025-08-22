const BASE_GATEWAY_URL = "http://localhost:5266";

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

const userAPI = crudAPI(`${BASE_GATEWAY_URL}/user`);

const currencyAPI = crudCurrencyAPI(`${BASE_GATEWAY_URL}/currency`);

const historyAPI = crhistoryAPI(`${BASE_GATEWAY_URL}/history`);

const authAPI = {
  login: () => `${BASE_GATEWAY_URL}/auth/login`,
  profile: () => `${BASE_GATEWAY_URL}/auth/profile`,
  logout: () => `${BASE_GATEWAY_URL}/auth/logout`,         // Supondo que você queira implementar
  refreshToken: () => `${BASE_GATEWAY_URL}/auth/refreshtoken`, // Supondo que esteja no backend
};

export { userAPI, authAPI, currencyAPI, historyAPI };
