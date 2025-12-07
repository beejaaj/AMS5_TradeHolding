import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI, authAPI } from "./API";

export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    photo: string;
}

const userService = {
    async getAll(): Promise<User[]> {
        let token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado.");
        token = token.replace(/"/g, '').trim();

        const response = await axios.get(userAPI.getAll(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        let token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token ausente");
        token = token.replace(/"/g, '').trim();

        await axios.delete(userAPI.delete(id), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    async create(userData: User): Promise<void> {
        
        await axios.post(userAPI.create(), userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    },
    
    async getProfile(): Promise<User> {
        let token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado.");
        token = token.replace(/"/g, '').trim();

        const response = await axios.get(authAPI.profile(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        return response.data; 
    }
};

export default userService;