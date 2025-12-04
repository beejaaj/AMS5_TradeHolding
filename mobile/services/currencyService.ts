
import axios from "axios";
import { currencyAPI } from "./API";
import { Currency } from "./types";

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
    async deleteCurrency(id: number): Promise<void> {
        await axios.delete(currencyAPI.deleteCurrency(id));
    }
};

export default currencyService;