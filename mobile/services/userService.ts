import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI, authAPI } from "./API";
import { User, LoginCredentials } from "./types";

// Helper para pegar o token limpo
const getHeaders = async () => {
    let token = await AsyncStorage.getItem("token");
    
    if (!token) {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Remove aspas e espaços
    token = token.trim().replace(/['"]+/g, '');

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

const userService = {
    // --- AUTH ---
    async login(credentials: LoginCredentials) {
        const response = await axios.post(authAPI.login(), credentials);
        
        if (response.data.token) {
            await AsyncStorage.setItem("token", response.data.token);
            
            const userData = response.data.user || response.data.User;
            if (userData && userData.id) {
                await AsyncStorage.setItem("userId", String(userData.id));
                await AsyncStorage.setItem("userEmail", userData.email);
            }
        }
        return response.data;
    },

    async getProfile(): Promise<User> {
        const headers = await getHeaders();
        const response = await axios.get(authAPI.profile(), { headers });
        return response.data;
    },

    // --- CRUD ---
    async getAll(): Promise<User[]> {
        const headers = await getHeaders();
        const response = await axios.get(userAPI.getAll(), { headers });
        return response.data;
    },

    async getById(id: string | number): Promise<User> {
        const headers = await getHeaders();
        const response = await axios.get(userAPI.getById(id), { headers });
        return response.data;
    },

    async register(data: Partial<User>) {
        const response = await axios.post(userAPI.create(), data);
        return response.data;
    },

    async create(data: Partial<User>) {
        return this.register(data);
    },

    async update(id: string | number, data: Partial<User>) {
        const headers = await getHeaders();
        const response = await axios.put(userAPI.edit(id), data, { headers });
        return response.data;
    },

    async delete(id: number | string): Promise<void> {
        const headers = await getHeaders();
        await axios.delete(userAPI.delete(id), { headers });
    },
};

export default userService;