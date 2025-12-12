# WalletAPI

Uma API ASP.NET Core responsável pela gestão de carteiras (wallets) do sistema — saldos, consultas e operações relacionadas a wallets. Este README foi preparado com base no modelo fornecido, organizado para facilitar execução local, uso em Docker e integração com outros serviços.

## Sumário
- Identificação
- Stack e dependências
- Pré-requisitos
- Configuração (variáveis de ambiente)
- Execução local
- Execução com Docker
- Banco de dados e migrações
- Autenticação
- Endpoints principais
- Exemplos de requisição
- Integrações
- Observações e problemas conhecidos
- Contribuição e License

## Identificação
WalletAPI fornece endpoints HTTP (controllers ASP.NET Core) para operações de carteiras. Rotas protegidas exigem autenticação via JWT. Em ambiente Development, o Swagger UI está habilitado para descoberta das rotas.

## Stack e dependências
- Linguagem / Runtime: C# / .NET 8
- Banco de dados: SQLite (arquivo local `wallet.db`)
- ORM: Entity Framework Core (DbContext: `WalletDbContext`)
- Autenticação: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- Http Client: System.Net.Http (registrado via `AddHttpClient`)
- Documentação: Swagger (AddSwaggerGen) — habilitado apenas em Development

## Pré-requisitos
- .NET 8 SDK instalado
- (Opcional) Docker e Docker Compose, se usar containers

## Configuração (variáveis de ambiente)
A aplicação lê algumas configurações via `IConfiguration`. Valores úteis a ajustar em produção:

- Jwt:Key — chave secreta para assinatura dos tokens JWT. Se não definida, a aplicação usa uma chave padrão insegura (apenas para desenvolvimento):
  `palavras123456789giganteparaumcarambaessachave`
- ASPNETCORE_ENVIRONMENT — defina `Development` para habilitar Swagger ou `Production` em produção.
- (Opcional) Data:ConnectionString — se você alterar o código para ler a string de conexão por variável, defina algo como `Data Source=/path/to/wallet.db`.

Observações:
- Atualmente a string de conexão do SQLite está hardcoded em `Program.cs` como:
  `opt.UseSqlite("Data Source=wallet.db")`
  Para produção, mude para leitura via variável de ambiente ou arquivo de configuração.

## Execução local
1. Restaurar pacotes:
   dotnet restore

2. (Opcional) Build:
   dotnet build

3. Executar:
   dotnet run

A aplicação irá escutar nas portas padrões do ASP.NET Core (consulte a saída do `dotnet run`, geralmente http://localhost:5000 / https://localhost:5001). Em ambiente `Development`, o Swagger estará disponível em `/swagger`.

## Execução com Docker
1. Build da imagem:
   docker build -t walletapi .

2. Executar (expondo porta 8080):
   docker run -p 8080:8080 walletapi

Observação: o projeto atualmente usa `wallet.db` no diretório de trabalho. Para persistir dados entre execuções, monte um volume apontando para um diretório do host:
   docker run -v $(pwd)/data:/app -p 8080:8080 walletapi

Ajustes no Dockerfile e nas configurações podem ser necessários para garantir que a aplicação use a mesma pasta onde o `wallet.db` está persistido.

## Banco de dados e migrações
- O repositório inclui um arquivo `wallet.db` (e possivelmente WAL/shm). Estes podem conter dados de exemplo.
- Se preferir usar migrations em vez do arquivo incluído:
  - Instale as ferramentas EF Core (se necessário):
    dotnet tool install --global dotnet-ef
  - Criar/Aplicar migrações:
    dotnet ef migrations add InitialCreate
    dotnet ef database update

Atenção: o projeto pode precisar de ajustes no connection string se você migrar para ler a string via configuração.

## Autenticação
- Todas as rotas protegidas exigem um token JWT no header:
  Authorization: Bearer <token>

- A validação de emissor (issuer) e audience está desabilitada no código (aceita qualquer issuer/audience desde que a assinatura JWT verifique com a chave configurada). O clock skew está configurado para zero.

- Em produção:
  - Configure `Jwt:Key` com um segredo forte.
  - Considere habilitar validação de Issuer e Audience.

## Endpoints principais
As rotas são mapeadas com `app.MapControllers()`. Para descobrir rotas específicas, consulte:
- Swagger UI (quando rodando em Development): /swagger
- Os controllers na pasta `API` no código-fonte
- O arquivo `walletApi.http` no repositório que contém exemplos prontos de requisições

Exemplos de recursos esperados:
- GET /api/wallet/balance — retorna saldo do usuário
- POST /api/wallet/transfer — realiza transferência entre wallets
(Observação: rotas concretas devem ser conferidas nos controllers)

## Exemplos de requisição
- Cabeçalho de autenticação:
  Authorization: Bearer eyJ...

- Requisição genérica para obter saldo:
  GET /api/wallet/balance
  Headers:
    Authorization: Bearer <token>
  Response exemplo:
  {
    "userId": "string",
    "balance": 123.45
  }

- Use o arquivo `walletApi.http` incluso no repositório para exemplos prontos de requisições (pode ser aberto em VS Code com a extensão REST Client).

## Integrações com outros serviços
- A aplicação registra `WalletService` via DI (AddScoped).
- `AddHttpClient()` está registrado, portanto a API pode consumir outros serviços HTTP (ex.: UserAPI para validação de usuários).
- Não há evidência direta de mensageria (RabbitMQ) ou publicação de eventos no `Program.cs`; se necessário, verifique as camadas de Infrastructure/Application.

## Observações / Known Issues
- Chave JWT padrão no código é insegura. Configurar segredo forte em produção.
- Validação de issuer/audience está desabilitada — avaliar e habilitar para segurança em ambientes reais.
- String de conexão do SQLite está hardcoded para `wallet.db`. Recomenda-se mover para configuração externa.
- O repositório contém `wallet.db` e arquivos WAL (`wallet.db-shm`, `wallet.db-wal`) — esses podem conter dados de exemplo; considere removê-los do repositório e usar migrations iniciais.
- Swagger está habilitado somente em `Development` por padrão.

## Boas práticas para produção
- Use uma chave JWT forte via secrets manager ou variáveis de ambiente.
- Habilite e configure validação de Issuer/Audience no JWT Bearer.
- Externalize a string de conexão e use um banco gerenciado ou um caminho de arquivo persistente.
- Remova arquivos de banco reais do repositório e use migrations para criação de esquema.

## Contribuindo
- Abra issues descrevendo bugs ou melhorias.
- Para mudanças de código, crie uma branch com um PR contendo descrições claras e testes quando aplicável.

## License
(Adicionar a licença do projeto aqui, se aplicável — ex: MIT)
