import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI } from "./API";

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
    // Buscar todos (Já existente)
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

    // Deletar (Já existente)
    async delete(id: number): Promise<void> {
        let token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token ausente");
        token = token.replace(/"/g, '').trim();

        await axios.delete(userAPI.delete(id), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // --- NOVO MÉTODO DE CRIAR ---
    async create(userData: User): Promise<void> {
        // Cadastro geralmente é público (não precisa de token), 
        // mas verifique se seu backend exige.
        // Se exigir token, copie a lógica de pegar o token acima.
        
        await axios.post(userAPI.create(), userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }
};

export default userService;