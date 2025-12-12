import axios from "axios";
import { walletAPI, chatbotAPI } from "./API";
import { Wallet, CreateWalletDto, DepositDto, TradeDto, TransferDto } from "./types";

const getHeaders = () => {
    let token = localStorage.getItem("token");
    
    if (!token) {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    token = token.trim();
    token = token.replace(/['"]+/g, '');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const walletService = {
    async getUserWallets(userId: number | string): Promise<Wallet[]> {
        const timestamp = new Date().getTime(); 
        const response = await axios.get(`${walletAPI.getWallets(userId)}?t=${timestamp}`, { headers: getHeaders() });
        return response.data;
    },

    async createWallet(data: CreateWalletDto) {
        const response = await axios.post(walletAPI.create(), data, { headers: getHeaders() });
        return response.data;
    },

    async deposit(data: DepositDto) {
        const response = await axios.post(walletAPI.deposit(), data, { headers: getHeaders() });
        return response.data;
    },

    async trade(data: TradeDto) {
        const response = await axios.post(walletAPI.trade(), data, { headers: getHeaders() });
        return response.data;
    },
    async getWalletDetails(userId: number | string, walletId: number) {
        const response = await axios.get(`${walletAPI.getDetails(walletId)}?userId=${userId}`, { headers: getHeaders() });
        return response.data;
    },

    async transfer(data: TransferDto) {
        const response = await axios.post(walletAPI.transfer(), data, { headers: getHeaders() });
        return response.data;
    },

};

export default walletService;