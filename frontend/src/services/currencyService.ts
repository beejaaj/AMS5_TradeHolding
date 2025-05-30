import axios from "axios";
import {currencyAPI} from "./API";

export interface Currency{
    id?: number;
    symbol: string;
    name: string;
    description: string;
    backing: string;
    status: string;
}

const currencyService = {
    async getAllCurrency() : Promise<Currency[]>{
        const header = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        const response = await axios.get(currencyAPI.getAllCurrency(), header);
        return response.data;   
    }
}

export default currencyService;