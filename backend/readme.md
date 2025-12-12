# 🚀 AMS TradeHolding - MVP

Bem-vindo ao **AMS TradeHolding**, uma plataforma de simulação de corretora de criptomoedas baseada em arquitetura de microsserviços. Este projeto demonstra o fluxo completo de operações financeiras: autenticação, consulta de saldo, depósitos, trades em tempo real e assistência via chatbot.

---

## 📋 Sobre o Projeto

Este MVP (Produto Mínimo Viável) foi desenvolvido para entregar um conjunto funcional e integrável de serviços que permitem:
1. **Autenticação Segura:** Login e proteção de rotas via JWT.
2. **Carteira Digital:** Gestão de saldo em múltiplas moedas (USD, BRL, BTC, ETH).
3. **Trading:** Compra e venda de ativos com cotações simuladas.
4. **Assistência Inteligente:** Chatbot capaz de entender linguagem natural para consultar saldos e operar a conta.
5. **Integração:** Uso de API Gateway para centralizar a comunicação.

---

## 🏗 Arquitetura do Sistema

O sistema é composto por 5 microsserviços backend e 1 frontend:

| Serviço | Porta | Tecnologia | Responsabilidade |
| :--- | :--- | :--- | :--- |
| **Gateway API** | `5266` | .NET 9 / Ocelot | Ponto único de entrada e roteamento. |
| **User API** | `5193` | .NET 9 | Cadastro e Autenticação (JWT). |
| **Wallet API** | `5297` | .NET 9 | Gestão de Carteiras, Depósitos e Trades. |
| **Currency API** | `5284` | .NET 9 | Cotações e Histórico de Moedas. |
| **Chatbot API** | `5005` | Python / FastAPI | Processamento de Linguagem Natural. |
| **Frontend** | `3000` | Next.js / React | Interface do Usuário. |

---

## 🛠 Pré-requisitos

Para executar o projeto, certifique-se de ter instalado em sua máquina:
* **[.NET SDK 9.0](https://dotnet.microsoft.com/download)** (Backend)
* **[Node.js](https://nodejs.org/)** (Frontend, versão 18+ recomendada)
* **[Python](https://www.python.org/downloads/)** (Chatbot, versão 3.8+)
  * *Nota:* Certifique-se de marcar "Add Python to PATH" durante a instalação.

---

## 🚀 Como Executar (Modo Automático)

Para facilitar a avaliação, incluímos scripts de automação na raiz do projeto.

### 1. Instalação de Dependências
Execute este script **uma única vez** para baixar as bibliotecas do Node, pacotes NuGet e requirements do Python.
- **Windows:** Clique duas vezes em `install-deps.bat`.

### 2. Iniciar o Sistema
Execute este script para abrir todos os serviços simultaneamente (cada um em sua própria janela).
- **Windows:** Clique duas vezes em `start-all.bat`.

> **Atenção:** Aguarde alguns segundos até que todas as janelas indiquem que os serviços estão rodando antes de acessar o frontend.

---

## 🔧 Como Executar (Modo Manual)

Caso prefira rodar serviço por serviço, abra terminais separados para cada pasta:

1.  **Gateway API:**
    ```bash
    cd backend/gatewayApi && dotnet run
    ```
2.  **User API:**
    ```bash
    cd backend/userApi && dotnet run
    ```
3.  **Currency API:**
    ```bash
    cd backend/currencyApi && dotnet run
    ```
4.  **Wallet API:**
    ```bash
    cd backend/walletApi && dotnet run
    ```
5.  **Chatbot API:**
    ```bash
    cd backend/chatbotApi && py -m uvicorn main:app --reload --port 5005
    ```
6.  **Frontend:**
    ```bash
    cd frontend && npm run dev
    ```

---

## ✅ Status do MVP (Checklist de Entrega)

| Requisito | Status | Detalhes |
| :--- | :--- | :--- |
| **Autenticação (JWT)** | ✅ Pronto | Login funcional com proteção de rotas no Gateway. |
| **Consulta de Saldo** | ✅ Pronto | Exibição correta na Home e via Chatbot. |
| **Depósito Simulado** | ✅ Pronto | Adição de fundos via API e Chatbot. |
| **Trade (Compra/Venda)** | ✅ Pronto | Conversão de moedas com validação de saldo. |
| **Cotações** | ✅ Pronto | Listagem de moedas e preços atualizados. |
| **Chatbot Inteligente** | ✅ Pronto | Comandos: *"Saldo"*, *"Depositar 100 USD"*. |
| **Frontend** | ✅ Pronto | Telas de Login, Dashboard, Trade e Chat Widget. |
| **Documentação** | ✅ Pronto | READMEs individuais e scripts de execução. |

---

## 🧪 Roteiro de Teste (Demo)

Para testar o fluxo completo do MVP, siga estes passos:

1.  Acesse `http://localhost:3000`.
2.  Clique em **"Registre-se grátis"** e crie uma conta.
3.  Faça **Login**. Você verá o Dashboard com saldo zerado.
4.  Abra o **Chatbot** (canto inferior direito) e digite:
    * *"Qual meu saldo?"* (Resposta: Você ainda não possui carteiras...)
    * *"Criar carteira USD"*
    * *"Depositar 1000 USD"*
5.  Atualize a página (F5) ou verifique o saldo no topo.
6.  Vá até a aba **"Carteiras"** ou use o botão **"Trade"**.
7.  Compre **BTC** usando seu saldo em USD.
8.  Verifique se os saldos foram atualizados corretamente.

---
