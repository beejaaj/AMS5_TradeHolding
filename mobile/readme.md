# AMS5 TradeHolding – Frontend (Mobile)
##Descrição

Este diretório contém o frontend desenvolvido em Next.js para o projeto AMS5 TradeHolding. Ele é responsável pela interface do usuário e comunicação com os serviços do backend por meio de requisições HTTP.

## Tecnologias Utilizadas

- Next.js 13.5.8

- React 18

- TailwindCSS

- Axios

- Recharts

- TypeScript

- PostCSS

- ESLint

## Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/beejaaj/AMS5_TradeHolding.git
cd AMS5_TradeHolding/mobile
```

2. Instale as dependências:

```npm install```


3. Ambiente de desenvolvimento:

```npm run dev```


4. Build para produção:

```npm run build```


5. Executar o servidor de produção:

```npm start```


6. Linting:

```npm run lint```

## Estrutura do Projeto

```mobile/
├── src/
│   ├── app/                # Rotas e páginas (Next.js App Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── services/           # Lógica e chamadas de API
│   └── styles/             # Estilos globais
├── public/                 # Arquivos públicos
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```
## Scripts Disponíveis
- dev  | Inicia o servidor de desenvolvimento 
- build  | Gera o build de produção
- start   | Executa o servidor com o build gerado
- lint    | Executa análise de lint

## Configuração de Ambiente

Caso existam variáveis de ambiente, crie um arquivo .env.local com os valores necessários:

API_URL=
OUTRAS_VARIAVEIS=
