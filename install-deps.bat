@echo off
echo ===================================================
echo Instalando dependencias do Ecossistema AMS TradeHolding
echo ===================================================

:: 1. Frontend (Node.js)
echo.
echo [1/4] Instalando dependencias do Frontend (Next.js)...
cd frontend
call npm install
cd ..
echo Frontend OK!

:: 2. Chatbot API (Python)
echo.
echo [2/4] Instalando dependencias do Chatbot...
cd backend/chatbotApi
echo Tentando instalar via Python Launcher (py)...
py -m pip install -r requirements.txt
cd ../..
echo Chatbot OK!

:: 3. Backend APIs (.NET)
echo.
echo [3/4] Restaurando pacotes das APIs .NET...

echo - Gateway API...
dotnet restore backend/gatewayApi/gatewayApi.csproj

echo - User API...
dotnet restore backend/userApi/userApi.csproj

echo - Currency API...
dotnet restore backend/currencyApi/currencyApi.csproj

echo - Wallet API...
dotnet restore backend/walletApi/walletApi.csproj

:: 4. Mobile (React Native)
echo.
echo [4/4] Instalando dependencias do Mobile...
cd mobile
call npm install
cd ..
echo Mobile OK!

echo.
echo ===================================================
echo Todas as dependencias foram instaladas!
echo Agora voce pode rodar o 'start-all.bat'.
echo ===================================================
pause