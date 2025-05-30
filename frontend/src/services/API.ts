import { create } from "domain";

const BASE_URL = "http://localhost:5193/api";
const BASE_URL2 = "http://localhost:5284/api";

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAllCurrency: () => `${basePath}`,
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

const userAPI = crudAPI(`${BASE_URL}/User`);

const currencyAPI = crudCurrencyAPI(`${BASE_URL2}/Currency`);

const authAPI = {
  login: () => `${BASE_URL}/Auth/Login`,
  logout: () => `${BASE_URL}/Auth/Logout`,
  refreshToken: () => `${BASE_URL}/Auth/RefreshToken`,
};

export { userAPI, authAPI, currencyAPI };