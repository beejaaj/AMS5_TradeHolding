from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import re
import os
import httpx
from datetime import datetime

app = FastAPI(title="Chatbot Service AMS - Intelligent Operations")

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
    token: Optional[str] = "" 

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []

async def fetch_get(endpoint: str, token: str = ""):
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(f"{GATEWAY_BASE}{endpoint}", headers=headers)
            if resp.status_code == 200: return resp.json()
        except: pass
    return None

async def fetch_post(endpoint: str, data: dict, token: str):
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

async def find_wallet_id_by_symbol(user_id: int, symbol: str, token: str):
    wallets = await fetch_get(f"/wallet/{user_id}", token)
    if not wallets: return None
    for w in wallets:
        if w.get("currencySymbol", "").upper() == symbol.upper():
            return w.get("id")
    return None

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

INTENT_PATTERNS = {
    "saudacao": [r"\boi\b", r"\bol[aá]\b", r"bom dia", r"boa tarde", r"boa noite", r"eai", r"hey", r"ola", r"hi", r"hello"],
    "saldo": [r"saldo", r"quanto tenho", r"meu dinheiro", r"minha conta", r"valores", r"patrimonio", r"grana", r"ver meu saldo"],
    "cotacao": [r"preço", r"cotação", r"valor do", r"quanto custa", r"tabela", r"listar moedas", r"quais moedas", r"ver moedas", r"mercado", r"cotações"],
    "ajuda": [r"ajuda", r"socorro", r"o que voc[eê] faz", r"menu", r"opç[oõ]es", r"help", r"suporte", r"comandos"],
    "trade_info": [r"fazer trade", r"como comprar", r"quero investir", r"trocar moeda", r"negociar"], 
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
        msg = "💰 **Seus Saldos Atuais:**\n" + "\n".join(parts)
        suggestions = ["Fazer Trade", "Cotações", "Transferir"] if has_usd else ["Criar carteira USD", "Cotações"]
        return {"text": msg, "sug": suggestions}
    
    return {
        "text": "Você ainda não possui carteiras ativas. Que tal começar?", 
        "sug": ["Criar carteira USD", "Ajuda"]
    }

def get_time_greeting():
    hour = datetime.now().hour
    if 5 <= hour < 12: return "Bom dia"
    elif 12 <= hour < 18: return "Boa tarde"
    else: return "Boa noite"

@app.post('/chatbot/message', response_model=ChatResponse)
async def handle_message(req: ChatRequest):
    text = req.message.strip()
    text_lower = text.lower()
    
    match = re.search(r"criar carteira\s+(\w+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para criar carteiras.", suggestions=["Ajuda"])
        symbol = match.group(1)
        reply = await action_criar_carteira(req.userId, req.token, symbol)
        return ChatResponse(reply=reply, suggestions=[f"Depositar 100 {symbol.upper()}", "Ver saldo"])

    match = re.search(r"depositar\s+(\d+)\s+(\w+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para depositar.", suggestions=["Ajuda"])
        reply = await action_depositar(req.userId, req.token, float(match.group(1)), match.group(2))
        if "NO_WALLET" in reply:
            symbol = reply.split(":")[1]
            return ChatResponse(reply=f"⚠️ Você não tem uma carteira de **{symbol}**. Deseja criar agora?", suggestions=[f"Criar carteira {symbol}"])
        return ChatResponse(reply=reply, suggestions=["Ver saldo", "Fazer Trade"])

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
        return ChatResponse(reply=reply, suggestions=["Ver saldo", "Cotações"])

    match = re.search(r"nova moeda\s+(\w+)\s+(.+)", text_lower)
    if match:
        if not req.token or req.userId <= 0: return ChatResponse(reply="🔒 Faça login para cadastrar moedas.", suggestions=["Ajuda"])
        reply = await action_nova_moeda(req.token, match.group(1), match.group(2))
        return ChatResponse(reply=reply, suggestions=[f"Criar carteira {match.group(1).upper()}", "Cotações"])

    intent = await detect_intent(text)
    
    if intent == "saudacao":
        greeting = get_time_greeting()
        if req.userId > 0:
            res = await get_balance_formatted(req.userId, req.token)
            suggestion_list = ["Ver saldo", "Fazer Trade", "Cotações"]
            reply = f"{greeting}! Sou o Assistente Inteligente da Lunaria.\n\n{res['text']}\n\nComo posso te ajudar agora?"
        else:
            suggestion_list = ["Cotações", "Ajuda"]
            reply = f"{greeting}! Sou o Assistente da Lunaria. Faça login para acessar sua carteira. Como posso ajudar?"
        
        return ChatResponse(reply=reply, suggestions=suggestion_list)

    elif intent == "saldo":
        res = await get_balance_formatted(req.userId, req.token)
        return ChatResponse(reply=res["text"], suggestions=res["sug"])

    elif intent == "trade_info":
        currencies = await get_all_currencies()
        sug_trades = [f"Comprar 10 {c['symbol']}" for c in currencies[:3] if c['symbol'] != 'USD']
        if not sug_trades: sug_trades = ["Criar carteira USD", "Ver saldo"]
        
        return ChatResponse(
            reply="🔄 **Modo de Negociação**\n\nPara comprar criptomoedas, você usa seu saldo em USD.\nExemplo de comando: **'Comprar 50 BTC'** (Isso usará 50 USD).\n\nDeseja ver as cotações antes?",
            suggestions=["Ver Cotações"] + sug_trades
        )

    elif intent == "cotacao" or "listar" in text_lower or "quais" in text_lower:
        currencies = await get_all_currencies()
        if currencies:
            lines = []
            sug_coins = []
            for c in currencies:
                symbol = c.get('symbol', 'N/A')
                name = c.get('name', 'Moeda')
                
                histories = c.get('histories', [])
                price_str = ""
                trend_icon = "➖" 

                if histories:
                    sorted_hist = sorted(histories, key=lambda x: x.get('date', ''), reverse=True)
                    latest = sorted_hist[0]
                    val = float(latest.get('value', 0))
                    
                    if len(sorted_hist) > 1:
                        prev = sorted_hist[1]
                        prev_val = float(prev.get('value', 0))
                        if val > prev_val: trend_icon = "📈"
                        elif val < prev_val: trend_icon = "📉"

                    if val > 1:
                        price_str = f"💲 {val:,.2f}"
                    else:
                        price_str = f"💲 {val:,.6f}"
                else:
                    price_str = "(Sem histórico)"

                lines.append(f"{trend_icon} **{symbol}** - {name}: {price_str}")
                
                if symbol != 'USD' and len(sug_coins) < 3:
                    sug_coins.append(f"Comprar 10 {symbol}")

            msg = "\n".join(lines)
            return ChatResponse(
                reply=f"**📊 Mercado Cripto em Tempo Real:**\n\n{msg}\n\n_📈 Alta | 📉 Baixa | ➖ Estável_", 
                suggestions=sug_coins + ["Ver meu saldo"]
            )
        return ChatResponse(reply="Não consegui acessar os dados do mercado no momento.", suggestions=["Ajuda"])

    elif intent == "identidade":
        return ChatResponse(
            reply="🤖 Eu sou o **Lunaria Bot**, seu assistente financeiro virtual. Fui criado para facilitar suas operações de carteira, trades e consultas!",
            suggestions=["O que você faz?", "Ver saldo"]
        )

    elif intent == "agradecimento":
        return ChatResponse(
            reply="De nada! 😉 Estou sempre por aqui se precisar fazer mais dinheiro!",
            suggestions=["Ver saldo", "Cotações"]
        )

    elif intent == "ajuda":
        return ChatResponse(
            reply="**💡 Guia de Comandos Rápidos:**\n\n"
                  "🟢 **Básico:**\n"
                  "- 'Criar carteira USD'\n"
                  "- 'Ver meu saldo'\n\n"
                  "💸 **Transações:**\n"
                  "- 'Depositar 100 USD'\n"
                  "- 'Transferir 50 USD para [ID da Carteira]'\n\n"
                  "🔄 **Trade:**\n"
                  "- 'Comprar 10 BTC' (Usa seu saldo USD)\n"
                  "- 'Cotações' (Ver preços)\n\n"
                  "🛠 **Admin:**\n"
                  "- 'Nova moeda BRL Real Brasileiro'",
            suggestions=["Ver saldo", "Cotações", "Criar carteira USD"]
        )

    return ChatResponse(
        reply=f"Desculpe, não entendi '**{text}**'. 🤔\n\nTente usar comandos como 'Saldo', 'Cotação' ou 'Ajuda'.", 
        suggestions=["Ajuda", "Cotações", "Ver saldo"]
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5005, reload=True)