import axios from "axios";
import { currencyAPI } from "./API";

export interface Currency {
    id?: number | string;
    symbol: string;
    name: string;
    description: string;
    backing: string;
    status: string;
    reverse?: boolean;
}
const getHeaders = () => {
    const token = localStorage.getItem("token")?.trim().replace(/['"]+/g, '');

    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const currencyService = {
    async getAllCurrency(): Promise<Currency[]> {
        const headers = getHeaders();
        const response = await axios.get(currencyAPI.getAllCurrency(), { headers });
        return response.data;
    },

    async updateCurrency(id: string, data: Currency) {
        const headers = getHeaders();

        const payload = {
            Id: id,
            Symbol: data.symbol,
            Name: data.name,
            Description: data.description || "",
            Backing: data.backing,
            Status: data.status,
            Reverse: !!data.reverse
        };

        console.log("Payload enviado:", payload);

        const response = await axios.put(currencyAPI.updateCurrency(id), payload, { headers });
        return response.data;
    },
    async registerCurrency(data: Currency) {
        const headers = getHeaders();
        
        // Mapeia para PascalCase para o .NET não reclamar (Erro 400)
        const payload = {
            Symbol: data.symbol,
            Name: data.name,
            Description: data.description || "",
            Backing: data.backing,
            Status: data.status,
            Reverse: !!data.reverse
        };

        const response = await axios.post(currencyAPI.registerCurrency(), payload, { headers });
        return response.data;
    },
};

export default currencyService;
