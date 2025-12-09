import axios from "axios";
import { userAPI, authAPI } from "./API";

export interface User {
    id?: string | number;
    name: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    photo: string;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

// Em src/services/userService.ts

export const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(authAPI.login(), credentials);
    
    // Debug: Veja no console do navegador o que o backend está mandando exatamente
    console.log("Resposta do Login:", response.data);

    // Verificamos se temos o token
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // CORREÇÃO CRÍTICA AQUI:
        // O backend pode retornar "user" ou "User" dependendo da serialização.
        // O operador ?. (optional chaining) evita que o app quebre se for nulo.
        const userData = response.data.user || response.data.User;

        if (userData && userData.id) {
            // Garantimos que seja salvo como string
            localStorage.setItem("userId", String(userData.id));
            localStorage.setItem("userName", userData.name); // Opcional: útil para exibir no Header
            localStorage.setItem("userEmail", userData.email);
        } else {
            console.error("ERRO CRÍTICO: Token recebido, mas ID do usuário não encontrado na resposta!", response.data);
        }
    }
    
    return response.data;
};

const userService = {
    async getAll(): Promise<User[]> {
        const response = await axios.get(userAPI.getAll(), { headers: getHeaders() });
        return response.data;
    },

    async getById(id: string | number): Promise<User> {
        const response = await axios.get(userAPI.getById(id), { headers: getHeaders() });
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await axios.get(authAPI.profile(), { headers: getHeaders() });
        return response.data;
    },

    async register(data: Partial<User>) {
        const response = await axios.post(userAPI.create(), data);
        return response.data;
    },

    async update(id: string | number, data: Partial<User>) {
        const response = await axios.put(userAPI.edit(id), data, { headers: getHeaders() });
        return response.data;
    },

    async delete(id: string | number) {
        await axios.delete(userAPI.delete(id), { headers: getHeaders() });
    }
};

export default userService;