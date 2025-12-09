import axios from "axios";
import { walletAPI, chatbotAPI } from "./API";
import { Wallet, CreateWalletDto, DepositDto, TradeDto } from "./types";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const walletService = {
    // Busca carteiras do usuário
    async getUserWallets(userId: number | string): Promise<Wallet[]> {
        const response = await axios.get(walletAPI.getWallets(userId), { headers: getHeaders() });
        return response.data;
    },

    // Cria nova carteira
    async createWallet(data: CreateWalletDto) {
        const response = await axios.post(walletAPI.create(), data, { headers: getHeaders() });
        return response.data;
    },

    // Realiza depósito
    async deposit(data: DepositDto) {
        const response = await axios.post(walletAPI.deposit(), data, { headers: getHeaders() });
        return response.data;
    },

    // Realiza trade
    async trade(data: TradeDto) {
        const response = await axios.post(walletAPI.trade(), data, { headers: getHeaders() });
        return response.data;
    },

    // Envia mensagem para o Chatbot
    async sendMessage(userId: number, message: string) {
        // O backend python espera { "userId": 1, "message": "ola" }
        const response = await axios.post(chatbotAPI.message(), { userId, message });
        return response.data;
    }
};

export default walletService;