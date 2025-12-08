import axios from "axios";
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

export interface LoginCredentials {
    email: string;
    password?: string;
}

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
        const token = localStorage.getItem("token");
        console.log("Token gerado:", token);
        const response = await axios.get(userAPI.getAll(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return response.data;
    }
};

export default userService;