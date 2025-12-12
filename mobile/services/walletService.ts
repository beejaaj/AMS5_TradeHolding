import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { walletAPI, chatbotAPI } from "./API";
import { Wallet, CreateWalletDto, DepositDto, TradeDto, TransferDto } from "./types";

// Função auxiliar para pegar headers (AsyncStorage é assíncrono)
const getHeaders = async () => {
    let token = await AsyncStorage.getItem("token");
    
    if (!token) {
        // Retorna headers básicos se não tiver token, mas geralmente lança erro
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    
    // Limpeza de token igual ao Web
    token = token.trim().replace(/['"]+/g, '');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

const walletService = {
    // 1. Listar Carteiras
    async getUserWallets(userId: number | string): Promise<Wallet[]> {
        const headers = await getHeaders();
        // Adiciona timestamp para evitar cache (igual ao web)
        const timestamp = new Date().getTime();
        const response = await axios.get(`${walletAPI.getWallets(userId)}?t=${timestamp}`, { headers });
        return response.data;
    },

    // 2. Criar Carteira
    async createWallet(data: CreateWalletDto) {
        const headers = await getHeaders();
        
        // O Backend espera "Currency", mas o Front tem "currencySymbol".
        // Vamos renomear manualmente antes de enviar.
        const payload = {
            userId: data.userId,
            name: data.name,
            currency: data.currency // <--- O PULO DO GATO: Mapeia symbol para 'currency'
        };

        try {
            console.log("Enviando para o Backend:", payload); // Debug

            const response = await axios.post(walletAPI.create(), payload, { headers });
            return response.data;
        } catch (error: any) {
            console.error("Erro detalhado:", error.response?.data);
            throw error;
        }
    },

    // 3. Depositar
    async deposit(data: DepositDto) {
        const headers = await getHeaders();
        const response = await axios.post(walletAPI.deposit(), data, { headers });
        return response.data;
    },

    // 4. Trade (Troca)
    async trade(data: TradeDto) {
        const headers = await getHeaders();
        const response = await axios.post(walletAPI.trade(), data, { headers });
        return response.data;
    },

    // 5. Detalhes da Carteira (Rota Específica)
    // URL Final: .../wallet/details/{id}?userId={userId}
    async getWalletDetails(userId: number | string, walletId: number | string) {
        const headers = await getHeaders();
        // walletAPI.getDetails(walletId) retorna ".../wallet/details/3"
        // Nós adicionamos manualmente o "?userId=31"
        const url = `${walletAPI.getDetails(Number(walletId))}?userId=${userId}`;
        
        console.log("Fetching Wallet Details URL:", url); // Debug para garantir

        const response = await axios.get(url, { headers });
        return response.data;
    },

    // 6. Transferência
   // Atualize a assinatura para aceitar os dados corretos
    async transfer(data: { userId: number, fromWalletId: number, toWalletId: number, amount: number }) {
        const headers = await getHeaders();
        
        // Mapeamento EXATO para o C# DTO:
        // public record TransferDto(int UserId, int FromWalletId, int ToWalletId, decimal Amount);
        const payload = {
            UserId: data.userId,
            FromWalletId: data.fromWalletId,
            ToWalletId: data.toWalletId, // Backend pede ID, não Email
            Amount: data.amount
        };

        try {
            console.log("Transfer Payload:", payload); 

            const response = await axios.post(walletAPI.transfer(), payload, { headers });
            return response.data;
        } catch (error: any) {
            console.error("Erro Transferência:", error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // 7. Chatbot
    async sendMessage(userId: number | string, message: string) {
        const response = await axios.post(chatbotAPI.message(), { userId, message });
        return response.data;
    }
};

export default walletService;