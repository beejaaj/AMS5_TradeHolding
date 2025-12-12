import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { walletAPI, chatbotAPI } from "./API";
import { Wallet, CreateWalletDto, DepositDto, TradeDto } from "./types";

const getHeaders = async () => {
    let token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");
    
    token = token.trim().replace(/['"]+/g, '');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const walletService = {
    async getUserWallets(userId: number | string): Promise<Wallet[]> {
        const headers = await getHeaders();
        const response = await axios.get(walletAPI.getWallets(userId), { headers });
        return response.data;
    },

    async createWallet(data: CreateWalletDto) {
        const headers = await getHeaders();
        const response = await axios.post(walletAPI.create(), data, { headers });
        return response.data;
    },

    async deposit(data: DepositDto) {
        const headers = await getHeaders();
        const response = await axios.post(walletAPI.deposit(), data, { headers });
        return response.data;
    },

    async trade(data: TradeDto) {
        const headers = await getHeaders();
        const response = await axios.post(walletAPI.trade(), data, { headers });
        return response.data;
    },

    async sendMessage(userId: number | string, message: string) {
        const response = await axios.post(chatbotAPI.message(), { userId, message });
        return response.data;
    }
};

export default walletService;