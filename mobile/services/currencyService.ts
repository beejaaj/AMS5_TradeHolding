
import axios from "axios";
import { currencyAPI } from "./API";
import { Currency } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const currencyService = {
    async getAllCurrency(): Promise<Currency[]> {
        const header = {
            headers: {
                'Accept': 'application/json',
            }
        };
        const response = await axios.get(currencyAPI.getAllCurrency(), header);
        return response.data;   
    },
    async getCurrencyDetails(id: number | string): Promise<Currency> {
        const response = await axios.get(currencyAPI.getCurrencyDetails(id), {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;
    },
    async updateCurrency(id: number | string, currencyData: Currency): Promise<void> {
        // Se precisar de token, descomente as linhas abaixo:
        // let token = await AsyncStorage.getItem("token");
        // if (token) token = token.replace(/"/g, '').trim();

        await axios.put(currencyAPI.updateCurrency(id), currencyData, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // ...(token && { 'Authorization': `Bearer ${token}` }) 
            }
        });
    },
    async deleteCurrency(id: number): Promise<void> {
        await axios.delete(currencyAPI.deleteCurrency(id));
    },
    async registerCurrency(currencyData: Currency): Promise<void> {
        let token = await AsyncStorage.getItem("token");
        if (token) token = token.replace(/"/g, '').trim();

        await axios.post(currencyAPI.registerCurrency(), currencyData, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }) 
            }
        });
    }
};

export default currencyService;