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

export const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(authAPI.login(), credentials);
    
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", credentials.email);
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