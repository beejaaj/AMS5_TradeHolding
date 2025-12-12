# ChatbotAPI

## Identificação

ChatbotAPI é o serviço de assistente conversacional (Lunaria Bot) responsável por interpretar comandos dos usuários e orquestrar operações nas APIs internas (Wallet, Currency, etc.) via o Gateway. É implementado em FastAPI e expõe um endpoint único para envio de mensagens que retorna uma resposta com texto e sugestões.

## Stack e dependências

- Linguagem / Runtime: Python 3.x
- Framework web: FastAPI
- HTTP client assíncrono: httpx (AsyncClient)
- Execução ASGI: Uvicorn (usado no __main__)
- Validação/modelagem: Pydantic (BaseModel)
- CORS: fastapi.middleware.cors.CORSMiddleware (configurado para permitir todas as origens)
- Arquivos relevantes:
  - main.py — implementação do bot e rotas
  - requirements.txt — dependências do projeto
- Observações de configuração:
  - Variável de ambiente GATEWAY_BASE define a base do Gateway (default: http://localhost:5266).
  - O serviço depende fortemente do Gateway para acessar endpoints como /wallet, /currency, etc.
  - O servidor é iniciado em main.py com uvicorn em host 0.0.0.0 e porta 5005 (reload=True no __main__).

## Instruções de execução local

Pré-requisitos:
- Python 3.8+ (ou compatível)
- pip

Executando localmente:
- Instalar dependências:
  ```bash
  pip install -r requirements.txt
  ```
- Executar (modo direto):
  ```bash
  python main.py
  ```
  (ou usar uvicorn manualmente)
  ```bash
  uvicorn main:app --host 0.0.0.0 --port 5005 --reload
  ```

A aplicação escutará por padrão na porta 5005 (conforme main.py). Ajuste GATEWAY_BASE via variável de ambiente para apontar para o gateway correto.

## Endpoints principais

- POST /chatbot/message
  - Request model: ChatRequest
    - userId: int
    - message: str
    - token: Optional[str] = ""
  - Response model: ChatResponse
    - reply: str
    - suggestions: List[str]
- Observações:
  - O endpoint processa intents (saudação, saldo, cotação, trade, criar carteira, depositar, transferir, nova moeda, etc.) e pode disparar chamadas POST/GET ao Gateway.
  - Para operações que alteram estado (criar carteira, depositar, transferir, trade, criar moeda) é necessário fornecer um token JWT válido no campo token.

## Exemplos de Requisição/Resposta

Exemplo de requisição:
```json
POST /chatbot/message
{
  "userId": 123,
  "message": "Depositar 100 USD",
  "token": "eyJhbGciOi..."
}
```

Exemplo de resposta (modelo):
```json
{
  "reply": "💰 Depósito de **100 USD** realizado com sucesso!",
  "suggestions": ["Ver saldo", "Fazer Trade"]
}
```

Comandos reconhecidos (amostras):
- "Criar carteira USD"
- "Depositar 100 USD"
- "Transferir 50 USD para 10"
- "Comprar 10 BTC"
- "Cotações"
- "Nova moeda BTC Bitcoin"

## Integrações com outros serviços

- Comunicação síncrona via HTTP com o Gateway (GATEWAY_BASE) para:
  - Wallet endpoints: /wallet/{userId}, /wallet/create, /wallet/deposit, /wallet/transfer, /wallet/trade
  - Currency endpoints: /currency
- O bot não comunica diretamente com bancos ou serviços externos — sempre faz requisições através do Gateway.
- Depende de que o Gateway valide e repasse o JWT corretamente; muitas ações retornam mensagens condicionais se o token estiver ausente ou inválido.

## Observações / Known Issues

- CORS está configurado como permissivo (allow_origins=["*"]) — útil para desenvolvimento, mas inseguro em produção.
- Dependência do Gateway: se o Gateway estiver indisponível ou a base (GATEWAY_BASE) estiver incorreta, o bot não conseguirá executar ações e retornará mensagens de erro genéricas.
- Muitos fluxos exigem token JWT. main.py aceita token vazio por padrão, mas funções de escrita (depositar, criar carteira, trade, etc.) falham sem token — o comportamento é tratado com mensagens destinadas ao usuário.
- O servidor é inicializado com reload=True quando executado via python main.py (modo desenvolvimento). Remover --reload em produção.
- Timeouts e tratamento de erros nas chamadas HTTP são básicos (timeout=10s no AsyncClient); recomenda-se melhorar retry/backoff e logging para produção.
- Validar entrada do usuário: extração de valores (quantias, IDs) usa regex simples — cuidado com casos não triviais ou inputs mal-formados.
