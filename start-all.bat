@echo off
echo ==========================================
echo Iniciando o Ecossistema AMS TradeHolding
echo ==========================================

:: 1. Gateway API (Porta 5266)
echo Iniciando Gateway API...
start "Gateway API" cmd /k "dotnet run --project backend/gatewayApi/gatewayApi.csproj"

:: 2. User API (Porta 5193)
echo Iniciando User API...
start "User API" cmd /k "dotnet run --project backend/userApi/userApi.csproj"

:: 3. Currency API (Porta 5284)
echo Iniciando Currency API...
start "Currency API" cmd /k "dotnet run --project backend/currencyApi/currencyApi.csproj"

:: 4. Wallet API (Porta 5297)
echo Iniciando Wallet API...
start "Wallet API" cmd /k "dotnet run --project backend/walletApi/walletApi.csproj"

:: 5. Chatbot API (Python - Porta 5005)
echo Iniciando Chatbot API...
start "Chatbot API" cmd /k "cd backend/chatbotApi && python main.py"

:: 6. Frontend (Next.js - Porta 3000)
echo Iniciando Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ==========================================
echo Todos os servicos foram disparados!
echo Verifique as janelas abertas para erros.
echo ==========================================
pause