from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import os
import httpx # Cliente HTTP assíncrono

app = FastAPI(title="Chatbot Service AMS")

# URL do seu Gateway
GATEWAY_BASE = os.getenv('GATEWAY_BASE', 'http://localhost:5266')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    userId: int
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- LÓGICA INTELIGENTE ---

async def get_source_wallet_id(user_id: int, currency_symbol: str = "USD") -> int:
    """
    Busca dinamicamente o ID da carteira que tem a moeda base (ex: USD).
    Retorna None se não encontrar.
    """
    url = f"{GATEWAY_BASE}/wallet/{user_id}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                wallets = resp.json()
                # Procura a carteira que tem a moeda desejada (USD)
                for w in wallets:
                    if w.get("currencySymbol", "").upper() == currency_symbol.upper():
                        return w.get("id")
        except:
            return None
    return None

async def get_balance_via_gateway(user_id: int) -> str:
    url = f"{GATEWAY_BASE}/wallet/{user_id}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                wallets = resp.json()
                if not wallets: return "Você ainda não possui carteiras ativas."
                
                parts = []
                for w in wallets:
                    nome = w.get("name", "Carteira")
                    symbol = w.get("currencySymbol", "")
                    bal = w.get("balance", 0)
                    parts.append(f"- {nome}: {bal:,.2f} {symbol}")
                
                return "💰 **Seus Saldos:**\n" + "\n".join(parts)
            return "Não consegui acessar sua carteira no momento."
        except Exception as e:
            return f"Erro ao conectar com o Gateway: {str(e)}"

async def execute_trade_via_gateway(user_id: int, currency: str, amount_usd: float) -> str:
    # 1. BUSCA O ID DA CARTEIRA USD DINAMICAMENTE
    source_wallet_id = await get_source_wallet_id(user_id, "USD")
    
    if not source_wallet_id:
        return "⚠️ Erro: Você não tem uma carteira de 'USD' para usar o saldo."

    # 2. PREPARA O PAYLOAD COM O ID CERTO
    url = f"{GATEWAY_BASE}/wallet/trade"
    payload = {
        "userId": user_id,
        "fromWalletId": source_wallet_id, # Agora é dinâmico!
        "toCurrency": currency.upper(),
        "amount": amount_usd
    }

    # 3. EXECUTA O TRADE
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                return f"✅ Sucesso! Compra de {amount_usd} USD em {currency} realizada."
            elif resp.status_code == 400:
                # Tenta ler a mensagem de erro da API, se for JSON
                try:
                    error_json = resp.json()
                    # Verifica se o erro está dentro de "error" ou direto
                    msg = error_json.get("error") or str(error_json)
                except:
                    msg = "Erro desconhecido"
                return f"⚠️ Falha no trade: {msg}"
            else:
                return f"❌ Erro no servidor: {resp.status_code}"
        except Exception as e:
            return f"Erro ao processar trade: {str(e)}"

# --- ENDPOINT ---

@app.post('/chatbot/message', response_model=ChatResponse)
async def handle_message(req: ChatRequest):
    text = req.message.strip().lower()

    if re.search(r"\bsaldo\b|quanto tenho|dinheiro", text):
        reply = await get_balance_via_gateway(req.userId)
        return ChatResponse(reply=reply)

    match = re.search(r"comprar\s+(\w+)\s+(\d+)", text)
    if match:
        currency = match.group(1)
        amount = float(match.group(2))
        reply = await execute_trade_via_gateway(req.userId, currency, amount)
        return ChatResponse(reply=reply)

    if "preço" in text:
        return ChatResponse(reply="Para ver preços, consulte a aba de Cotações.")

    return ChatResponse(reply="Comandos: 'Qual meu saldo?' ou 'Comprar BTC 100'.")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5005, reload=True)