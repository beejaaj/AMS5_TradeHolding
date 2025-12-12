# Demo do Sistema – AMS5 TradeHolding

Este documento apresenta a demonstração completa do sistema AMS5 TradeHolding, descrevendo de forma objetiva como utilizar cada módulo da aplicação e acompanhar o fluxo principal do sistema.

## Visão Geral do Sistema

O AMS5 TradeHolding é composto por três módulos principais:

Frontend Web / Mobile: Interface utilizada pelo usuário para realizar operações e visualizar informações.

Backend (Wallet API): Responsável pelo gerenciamento de contas, saldos, transações e integração com RabbitMQ.

Serviços de Mensageria: Utilizados para processamento assíncrono, envio de eventos e integração entre módulos.

A comunicação ocorre principalmente via HTTP/REST e mensageria via RabbitMQ.

## Fluxo Geral da Aplicação

O usuário acessa o aplicativo mobile/web.

Realiza autenticação via JWT.

O frontend consulta o backend para:

Obter saldo

Consultar transações

Criar novas operações (depósitos, transferências etc.)

O backend processa a requisição e publica mensagens no RabbitMQ, quando aplicável.

O frontend atualiza a interface com o resultado da operação.

## Passo a Passo da Demonstração
### 1-Inicialização do Sistema
----------------------------------
- Inicie o backend (Wallet API).

- Garanta que o banco de dados SQLite está acessível.

- Inicie o serviço de mensageria RabbitMQ.

- Inicie o frontend:

- Frontend Web / Mobile (Next.js):

```
npm install
npm run dev
```

O sistema estará acessível normalmente em http://localhost:3000.


### 2-Tela de Login
---------------------------------------
- Abra o frontend.

- Insira suas credenciais.

- O sistema envia a requisição ao backend.

- Após a validação, um JWT é retornado e armazenado para as próximas operações.

Resultado esperado:

Usuário autenticado e redirecionado para o dashboard.

### 3-Dashboard
---------------------------------------
Nesta tela, o usuário visualiza:

- Saldo atual

- Atividades recentes

Possíveis ações (depositar, sacar, transferir)

- O frontend realiza automaticamente uma requisição para:
GET /wallet/balance

### 4–Consultar Transações
------------------------------------
Ao acessar a aba de transações:

O sistema envia:

GET /wallet/transactions


O backend retorna o histórico registrado no banco.

O frontend exibe os dados em gráficos e listas (via Recharts).

Resultado esperado:

Usuário visualiza todas as movimentações associadas à conta.

### 5-Realizar Depósito
---------------------------------------

Usuário acessa a função de depósito.

Informa o valor.

O frontend envia:

POST /wallet/deposit


O backend registra a operação no banco.

O backend publica evento no RabbitMQ (quando aplicável).

Frontend atualiza o saldo.

Resultado esperado:

Depósito aparece imediatamente no dashboard.

### 6–Realizar Saque
---------------------------------------
Fluxo idêntico ao depósito:

POST /wallet/withdraw


Resultado esperado:

Saldo atualizado e registro criado no histórico.

### 7-Transferência
-------------------------------------
Usuário informa destino e valor.

O frontend envia:

POST /wallet/transfer


Backend valida saldo e destino.

Operação registrada no banco.

Evento enviado ao RabbitMQ.

Dashboard atualizado.

Resultado esperado:

Saída registrada na conta principal e entrada na conta destino.


### 8-Mensageria (RabbitMQ)
---------------------------------
O backend utiliza o RabbitMQ para envio de eventos internos, como Processamento de transações, Notificações, Sincronizações entre módulos

Fluxo simplificado:

API recebe requisição.

Cria evento e envia para a fila.

Consumidores processam a mensagem.

A atualização é persistida e refletida no frontend.
