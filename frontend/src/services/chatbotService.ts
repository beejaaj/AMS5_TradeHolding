import axios from "axios";
import { chatbotAPI } from "./API";

const getHeaders = () => {
    // Cabeçalhos para falar com o GATEWAY/PYTHON
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

export interface ChatResponse {
    reply: string;
    suggestions?: string[];
}

const chatbotService = {
    async sendMessage(userId: number, message: string): Promise<ChatResponse> {
        try {
            // Pegamos o token aqui para enviar ao Python
            const token = localStorage.getItem("token")?.replace(/['"]+/g, '').trim() || "";

            const response = await axios.post(chatbotAPI.message(), { 
                userId, 
                message,
                token 
            }, { headers: getHeaders() });
            
            return response.data;
        } catch (error) {
            console.error("Erro no ChatbotService:", error);
            throw error;
        }
    }
};

export default chatbotService;