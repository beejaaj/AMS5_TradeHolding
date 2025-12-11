from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import re
import os
import httpx
from datetime import datetime

app = FastAPI(title="Chatbot Service AMS - Intelligent Operations")

# URL do Gateway (Ajuste se necessário para seu ambiente)
GATEWAY_BASE = os.getenv('GATEWAY_BASE', 'http://localhost:5266')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS ---
class ChatRequest(BaseModel):
    userId: int
    message: str
    token: Optional[str] = "" 

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []

# --- FUNÇÕES AUXILIARES DE API (GET/POST) ---

async def fetch_get(endpoint: str, token: str = ""):
    """Faz GET autenticado ou não no Gateway"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(f"{GATEWAY_BASE}{endpoint}", headers=headers)
            if resp.status_code == 200: return resp.json()
        except: pass
    return None

async def fetch_post(endpoint: str, data: dict, token: str):
    """Faz POST autenticado no Gateway"""
    if not token: return {"success": False, "error": "Token não fornecido"}
    
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.post(f"{GATEWAY_BASE}{endpoint}", json=data, headers=headers)
            if resp.status_code in [200, 201]:
                return {"success": True, "data": resp.json()}
            try:
                err = resp.json()
                return {"success": False, "error": err.get("error") or str(err)}
            except:
                return {"success": False, "error": f"Erro HTTP {resp.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

# --- INTELIGÊNCIA: BUSCA DE CARTEIRAS ---

async def find_wallet_id_by_symbol(user_id: int, symbol: str, token: str):
    wallets = await fetch_get(f"/wallet/{user_id}", token)
    if not wallets: return None
    for w in wallets:
        if w.get("currencySymbol", "").upper() == symbol.upper():
            return w.get("id")
    return None

# --- PROCESSADORES DE COMANDOS (ACTIONS) ---

async def action_criar_carteira(user_id: int, token: str, symbol: str):
    payload = { "userId": user_id, "name": f"Carteira {symbol.upper()}", "currency": symbol.upper() }
    res = await fetch_post("/wallet/create", payload, token)
    
    if res["success"]: return f"✅ Carteira de **{symbol.upper()}** criada com sucesso! Agora você pode depositar fundos."
    return f"⚠️ Falha ao criar carteira: {res.get('error')}"

async def action_depositar(user_id: int, token: str, amount: float, symbol: str):
    wallet_id = await find_wallet_id_by_symbol(user_id, symbol, token)
    if not wallet_id: return f"NO_WALLET:{symbol.upper()}"
    
    payload = { "userId": user_id, "walletId": wallet_id, "amount": amount }
    res = await fetch_post("/wallet/deposit", payload, token)
    
    if res["success"]: return f"💰 Depósito de **{amount} {symbol.upper()}** realizado com sucesso!"
    return f"⚠️ Erro no depósito: {res.get('error')}"

async def action_transferir(user_id: int, token: str, amount: float, symbol: str, target_id: int):
    source_id = await find_wallet_id_by_symbol(user_id, symbol, token)
    if not source_id: return f"NO_WALLET:{symbol.upper()}"
    
    payload = { "userId": user_id, "fromWalletId": source_id, "toWalletId": target_id, "amount": amount }
    res = await fetch_post("/wallet/transfer", payload, token)
    
    if res["success"]: return f"💸 Transferência de **{amount} {symbol.upper()}** para a carteira #{target_id} enviada!"
    return f"⚠️ Erro na transferência: {res.get('error')}"

async def action_trade(user_id: int, token: str, amount_pay: float, symbol_buy: str):
    source_id = await find_wallet_id_by_symbol(user_id, "USD", token)
    if not source_id: return "NO_WALLET:USD"
    
    payload = { "userId": user_id, "fromWalletId": source_id, "toCurrency": symbol_buy.upper(), "amount": amount_pay }
    res = await fetch_post("/wallet/trade", payload, token)
    
    if res["success"]: return f"🔄 Trade realizado! Compra de {symbol_buy.upper()} processada com sucesso."
    return f"⚠️ Erro no trade: {res.get('error')}"

async def action_nova_moeda(token: str, symbol: str, name: str):
    payload = { "symbol": symbol.upper(), "name": name, "description": "Via Chatbot", "backing": "USD", "status": "Active" }
    res = await fetch_post("/currency", payload, token)
    
    if res["success"]: return f"🪙 Moeda **{name} ({symbol.upper()})** cadastrada no sistema!"
    return f"⚠️ Erro ao cadastrar moeda: {res.get('error')}"

# --- SISTEMA DE INTELIGÊNCIA (INTENÇÕES) ---

INTENT_PATTERNS = {
    "saudacao": [r"\boi\b", r"\bol[aá]\b", r"bom dia", r"boa tarde", r"boa noite", r"eai", r"hey", r"ola"],
    "saldo": [r"saldo", r"quanto tenho", r"meu dinheiro", r"minha conta", r"valores", r"patrimonio"],
    "cotacao": [r"preço", r"cotação", r"valor do", r"quanto custa", r"tabela", r"listar moedas", r"quais moedas", r"ver moedas"],
    "ajuda": [r"ajuda", r"socorro", r"o que voc[eê] faz", r"menu", r"opç[oõ]es", r"help"],
    "identidade": [r"quem [eé] voc[eê]", r"seu nome", r"quem criou"],
    "agradecimento": [r"obrigado", r"valeu", r"agradecido", r"tks", r"grato"]
}

async def detect_intent(text: str) -> str:
    text = text.lower()
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text): return intent
    return "desconhecido"

async def get_all_currencies():
    currencies = await fetch_get("/currency")
    return currencies if currencies else []

async def get_balance_formatted(user_id: int, token: str) -> dict:
    if user_id <= 0: return {"text": "🔒 **Acesso Restrito:** Faça login para ver seu saldo.", "sug": ["Ajuda"]}
    
    wallets = await fetch_get(f"/wallet/{user_id}", token)
    if wallets:
        has_usd = any(w.get("currencySymbol", "").upper() == "USD" for w in wallets)
        parts = [f"💳 **{w['name']}**: {w['balance']:,.2f} {w['currencySymbol']}" for w in wallets]
        msg = "💰 **Seus Saldos:**\n" + "\n".join(parts)
        suggestions = ["Depositar 100 USD", "Fazer Trade", "Ajuda"] if has_usd else ["Criar carteira USD"]
        return {"text": msg, "sug": suggestions}
    
    return {
        "text": "Você ainda não possui carteiras ativas.", 
        "sug": ["Criar carteira USD"]
    }

def get_time_greeting():
    hour = datetime.now().hour
    if 5 <= hour < 12: return "Bom dia"
    elif 12 <= hour < 18: return "Boa tarde"
    else: return "Boa noite"

# --- LOOP PRINCIPAL ---

@app.post('/chatbot/message', response_model=ChatResponse)
async def handle_message(req: ChatRequest):
    text = req.message.strip()
    text_lower = text.lower()
    
    # 1. COMANDOS DIRETOS (Prioridade Alta)

    match = re.search(r"criar carteira\s+(\w+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para criar carteiras.", suggestions=["Ajuda"])
        symbol = match.group(1)
        reply = await action_criar_carteira(req.userId, req.token, symbol)
        return ChatResponse(reply=reply, suggestions=[f"Depositar 100 {symbol.upper()}"])

    match = re.search(r"depositar\s+(\d+)\s+(\w+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para depositar.", suggestions=["Ajuda"])
        reply = await action_depositar(req.userId, req.token, float(match.group(1)), match.group(2))
        if "NO_WALLET" in reply:
            symbol = reply.split(":")[1]
            return ChatResponse(reply=f"⚠️ Você não tem uma carteira de **{symbol}**. Deseja criar agora?", suggestions=[f"Criar carteira {symbol}"])
        return ChatResponse(reply=reply, suggestions=["Ver saldo"])

    match = re.search(r"transferir\s+(\d+)\s+(\w+)\s+para\s+(\d+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para transferir.", suggestions=["Ajuda"])
        reply = await action_transferir(req.userId, req.token, float(match.group(1)), match.group(2), int(match.group(3)))
        if "NO_WALLET" in reply:
            symbol = reply.split(":")[1]
            return ChatResponse(reply=f"⚠️ Você precisa de uma carteira de **{symbol}** para transferir.", suggestions=[f"Criar carteira {symbol}"])
        return ChatResponse(reply=reply, suggestions=["Ver saldo"])

    match = re.search(r"comprar\s+(\d+)\s+(\w+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para negociar.", suggestions=["Ajuda"])
        reply = await action_trade(req.userId, req.token, float(match.group(1)), match.group(2))
        if "NO_WALLET:USD" in reply:
            return ChatResponse(reply="⚠️ Para fazer trades, você precisa ter uma carteira de **USD** com saldo.", suggestions=["Criar carteira USD"])
        return ChatResponse(reply=reply, suggestions=["Ver saldo"])

    match = re.search(r"nova moeda\s+(\w+)\s+(.+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para cadastrar moedas.", suggestions=["Ajuda"])
        reply = await action_nova_moeda(req.token, match.group(1), match.group(2))
        return ChatResponse(reply=reply, suggestions=[f"Criar carteira {match.group(1).upper()}"])

    # 2. INTENÇÕES (Linguagem Natural)
    intent = await detect_intent(text)
    
    if intent == "saudacao":
        greeting = get_time_greeting()
        if req.userId > 0:
            res = await get_balance_formatted(req.userId, req.token)
            suggestions = res["sug"]
        else:
            suggestions = ["Cotações", "Ajuda"]
        reply = f"{greeting}! Sou o Assistente da Lunaria. Como posso te ajudar?"
        return ChatResponse(reply=reply, suggestions=suggestions)

    elif intent == "saldo":
        res = await get_balance_formatted(req.userId, req.token)
        return ChatResponse(reply=res["text"], suggestions=res["sug"])

    # --- LISTAGEM MELHORADA AQUI ---
    elif intent == "cotacao" or "listar" in text_lower or "quais" in text_lower:
        currencies = await get_all_currencies()
        if currencies:
            lines = []
            # Lista as top 10 moedas
            for c in currencies[:10]:
                symbol = c.get('symbol', 'N/A')
                name = c.get('name', 'Moeda')
                price_str = ""
                
                # Lógica para pegar o preço do histórico
                histories = c.get('histories', [])
                if histories:
                    # Ordena por data decrescente (mais recente primeiro) e pega o valor
                    latest = sorted(histories, key=lambda x: x.get('date', ''), reverse=True)[0]
                    val = float(latest.get('value', 0))
                    
                    # Formata o preço (se for muito pequeno, usa mais casas decimais)
                    if val > 1:
                        price_str = f" 💲 {val:,.2f}"
                    else:
                        price_str = f" 💲 {val:,.6f}"
                else:
                    price_str = " (Sem cotação)"

                lines.append(f"• **{symbol}** - {name}{price_str}")
            
            msg = "\n".join(lines)
            footer = ""
            if len(currencies) > 10:
                footer = f"\n\n*...e mais {len(currencies)-10} moedas.*"

            return ChatResponse(
                reply=f"**📊 Mercado Cripto Atual:**\n\n{msg}{footer}", 
                suggestions=["Criar carteira USD", "Ver meu saldo"]
            )
        return ChatResponse(reply="Erro ao buscar cotações.", suggestions=["Ajuda"])

    elif intent == "ajuda":
        return ChatResponse(
            reply="**Comandos:**\n\n- 'Criar carteira USD'\n- 'Depositar 100 USD'\n- 'Comprar 50 BTC' (Usa USD)\n- 'Transferir 10 USD para [ID]'\n- 'Nova moeda REAIS Reais'",
            suggestions=["Criar carteira USD", "Ver saldo"]
        )

    # Fallback
    return ChatResponse(
        reply="Não entendi. Tente usar os botões abaixo ou digite 'Ajuda' para ver os comandos.", 
        suggestions=["Criar carteira USD", "Ver Saldo", "Ajuda"]
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5005, reload=True)