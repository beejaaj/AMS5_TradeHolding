import axios from "axios";
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
    async getAll(): Promise<User[]> {
        const token = localStorage.getItem("token");
        console.log("Token gerado:", token);
        const response = await axios.get(userAPI.getAll(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        return response.data;
    }
};

export default userService;