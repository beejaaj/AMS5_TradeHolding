# WalletAPI

1. Identificação
----------------
WalletAPI é a API responsável pela gestão de carteiras (wallets) do sistema. Ela expõe controladores (controllers) via ASP.NET Core e exige autenticação via JWT para acessar rotas protegidas. A aplicação usa SQLite como armazenamento local e está preparada para documentação via Swagger (apenas em ambiente de Development).

2. Stack e dependências
-----------------------
- Linguagem / Runtime: C# / .NET 8
- Banco: SQLite (arquivo local `wallet.db` incluído no repositório)
- HTTP Client: System.Net.Http (registrado via AddHttpClient)
- Autenticação: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- Outras dependências:
  - Entity Framework Core (DbContext `WalletDbContext`)
  - Swagger (AddSwaggerGen)
- Observações de configuração:
  - A chave JWT é lida de `Configuration["Jwt:Key"]`. Se não definida, a aplicação usa uma chave padrão (insegura) definida no código:
    `palavras123456789giganteparaumcarambaessachave`
  - A configuração do banco está atualmente hardcoded em Program.cs:
    `opt.UseSqlite("Data Source=wallet.db")`
  - Validação de token: ValidateIssuer e ValidateAudience estão desabilitados (aceita tokens assinados com a chave correta, independente de issuer/audience). ClockSkew está definido como zero.

3. Instruções de execução local
-------------------------------
Pré-requisitos:
- .NET 8 SDK instalado
- (Opcional) Docker

Executando localmente:
- Restaurar dependências:
  dotnet restore
- Executar:
  dotnet run

A aplicação escutará conforme configuração padrão do ASP.NET (geralmente em http://localhost:5000 / https://localhost:5001) — ver saída do dotnet run.

Executando com Docker:
- Build:
  docker build -t walletapi .
- Run:
  docker run -p 8080:8080 walletapi

(Observação: o projeto não lê a string de conexão do ambiente — a aplicação usa `wallet.db` no diretório de trabalho. Ajustes no Dockerfile / volume podem ser necessários para persistir o arquivo .db.)

4. Endpoints principais
-----------------------
- Os controllers estão mapeados via `app.MapControllers()`; a lista precisa ser consultada via Swagger em ambiente de desenvolvimento (quando o app roda em Development, Swagger e SwaggerUI são habilitados).
- Há um arquivo `walletApi.http` no repositório com exemplos de requisições (use-o como referência).
- Para chamadas protegidas: envie o token JWT no header `Authorization: Bearer <token>`.

Observação: Este README não enumera rotas específicas porque os controllers e rotas concretas devem ser consultados diretamente no código-fonte (pasta `API`) ou via Swagger quando a aplicação estiver em execução.

5. Exemplos de Requisição/Resposta
----------------------------------
Autenticação (uso do token recebido de outro serviço):
- Header:
  Authorization: Bearer eyJ...

Exemplo de requisição para uma rota protegida (formato genérico):
- GET /api/wallet/balance
- Headers:
  - Authorization: Bearer <token>
- Response (exemplo genérico):
  {
    "userId": "string",
    "balance": 123.45
  }

(Use o Swagger UI ou o arquivo walletApi.http para exemplos concretos já incluídos no repositório.)

6. Integrações com outros serviços
----------------------------------
- A aplicação registra um serviço `WalletService` via DI (AddScoped).
- `AddHttpClient()` está registrado, indicando que a API pode consumir outros serviços HTTP (por exemplo, UserAPI para validação adicional de usuários ou para obtenção de dados).
- Não há evidência direta no Program.cs de integrações por mensageria (RabbitMQ) ou publicação de eventos — quaisquer integrações assíncronas devem ser verificadas nas camadas de Infrastructure/Application.

7. Observações / Known Issues
-----------------------------
- A chave JWT padrão definida no código é insegura. Configure um segredo forte em ambiente de produção através de `Jwt:Key`.
- A validação de issuer/audience está desabilitada — avaliar e ajustar em ambientes reais conforme necessidade de segurança.
- A string de conexão do SQLite está hardcoded (`wallet.db`). Para produção, mover para configuração externa e/ou variável de ambiente.
- O repositório contém o arquivo `wallet.db` e arquivos WAL (`wallet.db-shm`, `wallet.db-wal`) — estes podem conter dados de exemplo; considerar removê-los do repositório ou substituir por migrations iniciais.
- Swagger está habilitado somente em Development (ver Program.cs).
- Para descobrir rotas concretas e exemplos pronto-uso, abra a pasta `API` (contém os controllers) ou execute a aplicação em modo Development e navegue até `/swagger`.

Arquivos úteis no repositório
-----------------------------
- Program.cs — configuração da aplicação (autenticação, DbContext, serviços, Swagger).
- wallet.db, wallet.db-shm, wallet.db-wal — banco SQLite e arquivos WAL incluídos.
- walletApi.http — coleciona exemplos de requisições (inspecionar para ver endpoints e exemplos práticos).
- walletApi.csproj — dependências do projeto.

Contato / Contribuição
----------------------
Para mudanças no comportamento de autenticação, banco ou exposições de rota, edite `Program.cs` e os controllers na pasta `API`. Para dúvidas sobre o domínio, verifique a camada `Domain` e os serviços em `Application`.
