# AMS5_TradeHolding — Frontend

Esta pasta contém o frontend da aplicação, construído com Next.js + TypeScript e estilizado com Tailwind CSS. O projeto também usa bibliotecas como Axios para chamadas HTTP e Chart.js / react-chartjs-2 para gráficos.

## Tecnologias principais
- Next.js (app router)
- React + TypeScript
- Tailwind CSS + PostCSS
- Axios (requisições HTTP)
- Chart.js + react-chartjs-2 (gráficos)
- lucide-react / react-icons (ícones)

(versões e dependências completas estão em `package.json`)

## Pré-requisitos
- Node.js (recomenda-se v16+ ou v18+)
- npm, yarn ou pnpm (qualquer gerenciador de pacotes compatível)

## Instalação
1. Clone o repositório (na raiz do projeto):
   ```bash
   git clone https://github.com/beejaaj/AMS5_TradeHolding.git
   cd AMS5_TradeHolding/frontend
   ```
2. Instale dependências:
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

## Scripts úteis
- Desenvolvimento (hot-reload):
  ```bash
  npm run dev
  ```
  Abre a aplicação em http://localhost:3000 por padrão.

- Build para produção:
  ```bash
  npm run build
  ```

- Iniciar servidor de produção:
  ```bash
  npm start
  ```

- Lint:
  ```bash
  npm run lint
  ```

(Os scripts estão definidos em `package.json`.)

## Variáveis de ambiente
Adicione um arquivo `.env.local` na raiz da pasta `frontend` para variáveis específicas do ambiente. Exemplos comuns:
```
NEXT_PUBLIC_API_BASE_URL=https://api.exemplo.com
NEXT_PUBLIC_OTHER_FLAG=true
```
Substitua pelas variáveis usadas pelo seu backend/API. O prefixo `NEXT_PUBLIC_` torna a variável acessível no client-side.

## Estrutura sugerida
- app/ — (Next.js app router) páginas e layouts
- public/ — ativos estáticos (imagens, favicon, etc.)
- src/ — código fonte (components, hooks, utils, etc.)
- styles/ ou arquivos Tailwind configurados em `tailwind.config.ts`

(Adapte conforme a organização real do projeto.)

## Boas práticas
- Mantenha chamadas HTTP centralizadas (por exemplo, usar uma instância axios em `src/services/api.ts`).
- Componentize partes reutilizáveis (botões, inputs, charts).
- Utilize variáveis de ambiente para URLs e chaves sensíveis.
- Teste o build (`npm run build`) antes de deploy.

## Deploy
A aplicação é compatível com Vercel (deploy automático para Next.js) e também pode ser servida em servidores Node tradicionais:
- Para Vercel: conectar o repositório e configurar variáveis de ambiente no dashboard.
- Para servidor Node: executar `npm run build` e `npm start` no ambiente de produção.

## Contribuindo
- Abra issues para bugs e propostas de melhoria.
- Crie branches por feature/bugfix seguindo um padrão (ex.: `feat/descricao`, `fix/descricao`).
- Antes de subir PRs, rode lint e verifique o build.

## Onde ver mais
- Dependências e scripts: `package.json`
- Configuração do Tailwind: `tailwind.config.ts`
- Configuração do Next: `next.config.js`
- ESLint: `.eslintrc.json`

## Licença
Verifique a licença na raiz do repositório (ou adicione uma se for necessário).
