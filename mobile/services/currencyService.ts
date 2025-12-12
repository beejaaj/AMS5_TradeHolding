import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { currencyAPI } from "./API";
import { Currency } from "./types";

const getHeaders = async () => {
    let token = await AsyncStorage.getItem("token");
    if (token) token = token.trim().replace(/['"]+/g, '');
    
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const currencyService = {
    async getAllCurrency(): Promise<Currency[]> {
        const response = await axios.get(currencyAPI.getAllCurrency(), {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;   
    },

    async getCurrencyDetails(id: number | string): Promise<Currency> {
        const response = await axios.get(currencyAPI.getCurrencyDetails(id), {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;
    },

    async registerCurrency(currencyData: Currency): Promise<void> {
        const headers = await getHeaders();
        await axios.post(currencyAPI.registerCurrency(), currencyData, { headers });
    },

    async updateCurrency(id: number | string, currencyData: Currency): Promise<void> {
        const headers = await getHeaders();
        
        // CORREÇÃO: Forçar PascalCase para garantir compatibilidade com .NET
        const payload = {
            Id: id, // Alguns backends exigem o ID no corpo também
            Symbol: currencyData.symbol,
            Name: currencyData.name,
            Description: currencyData.description || "",
            Backing: currencyData.backing,
            Status: currencyData.status,
            Reverse: !!currencyData.reverse // Garante booleano
        };

        try {
            console.log("Payload Update:", payload); // Debug
            
            // Note que o ID vai na URL E no corpo (padrão comum em APIs REST .NET)
            await axios.put(currencyAPI.updateCurrency(id), payload, { headers });
        } catch (error: any) {
            console.error("Erro Update Backend:", error.response?.data || error.message);
            throw error;
        }
    },

    async deleteCurrency(id: number | string): Promise<void> {
        const headers = await getHeaders(); 
        await axios.delete(currencyAPI.deleteCurrency(id), { headers });
    },
};

export default currencyService;