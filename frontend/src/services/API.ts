import { create } from "domain";

const BASE_URL = "http://localhost:5193/api";

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

const userAPI = crudAPI(`${BASE_URL}/User`);

const authAPI = {
  login: () => `${BASE_URL}/Auth/Login`,
  logout: () => `${BASE_URL}/Auth/Logout`,
  refreshToken: () => `${BASE_URL}/Auth/RefreshToken`,
};

export { userAPI, authAPI };