# UserAPI

## Identificação
UserAPI fornece endpoints HTTP (controllers ASP.NET Core) para operações relacionadas a usuários — cadastro, consulta, atualização, remoção e autenticação (login/refresh token). Rotas sensíveis exigem autenticação via JWT. Em ambiente `Development`, o Swagger UI costuma estar habilitado para descoberta das rotas.

## Stack e dependências
- Linguagem / Runtime: C# / .NET 8
- ORM: Entity Framework Core (possível DbContext: `UserDbContext` — verificar no código)
- Autenticação: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- HTTP Client: System.Net.Http (pode estar registrado via `AddHttpClient`)
- Documentação: Swagger / Swashbuckle (AddSwaggerGen) — tipicamente habilitado em ambiente Development
- Outras bibliotecas: ver `*.csproj` do projeto para lista completa

Observação: para confirmar tecnologias exatas, consulte `Program.cs`, `Startup.cs` (se presente) e os arquivos `.csproj`.

## Pré-requisitos
- .NET 8 SDK instalado
- (Opcional) Docker e Docker Compose, caso vá executar em containers
- Ferramentas EF Core (opcional, para usar migrations):
  dotnet tool install --global dotnet-ef

## Configuração (variáveis de ambiente)
A aplicação lê configurações via `IConfiguration`. Valores úteis a ajustar em produção:

- Jwt:Key — chave secreta para assinatura dos tokens JWT. Se não definida, alguns projetos possuem uma chave padrão de desenvolvimento (insegura). Configure um segredo forte em produção.
- Jwt:Issuer — issuer esperado para tokens (caso a validação esteja habilitada).
- Jwt:Audience — audience esperado para tokens (caso a validação esteja habilitada).
- ASPNETCORE_ENVIRONMENT — defina `Development` para habilitar Swagger ou `Production` em produção.
- ConnectionStrings:DefaultConnection — string de conexão para o banco (se o projeto for configurado assim). Em muitos exemplos de desenvolvimento a aplicação usa SQLite com algo como `Data Source=user.db`. Verifique `Program.cs` para o que está efetivamente sendo usado.

Recomendações:
- Não deixar chaves sensíveis no código-fonte.
- Usar secrets manager, variáveis de ambiente ou Azure Key Vault / AWS Secrets Manager em produção.

## Execução local
1. Restaurar pacotes:
   dotnet restore

2. (Opcional) Build:
   dotnet build

3. Executar:
   dotnet run --project ./path/to/UserApi.csproj

A aplicação irá expor as portas configuradas pelo ASP.NET Core (ver saída do `dotnet run`, geralmente http://localhost:5000 / https://localhost:5001). Em `Development`, acesse `/swagger` para a documentação interativa.


## Banco de dados e migrações
- Verifique se o projeto inclui um arquivo de banco (ex.: `user.db`) ou se utiliza migrations.
- Para usar migrations com EF Core:
  - Criar migration:
    dotnet ef migrations add InitialCreate --project ./path/to/UserApi.csproj
  - Aplicar migração:
    dotnet ef database update --project ./path/to/UserApi.csproj

Observe que pode ser necessário ajustar a string de conexão em `appsettings.json` ou nas variáveis de ambiente.

## Autenticação
- Rotas protegidas exigem um token JWT no header:
  Authorization: Bearer <token>

- Validação de tokens:
  - Verifique em `Program.cs`/`Startup.cs` se `ValidateIssuer` e `ValidateAudience` estão habilitados. Em muitos cenários de desenvolvimento estas validações podem estar desabilitadas — habilite em produção.
  - `ClockSkew` pode estar ajustado para zero ou outro valor; confirme conforme necessidade.

- Em produção:
  - Configure `Jwt:Key` com um segredo forte.
  - Habilite validação de Issuer e Audience.
  - Considere usar refresh tokens seguros e rotacionamento de chaves.

## Endpoints principais (exemplos típicos)
Consulte os controllers para a lista real de rotas (ou abra o Swagger). Exemplos comuns (os caminhos exatos podem variar):

- POST /api/auth/register — criar novo usuário
- POST /api/auth/login — realizar login e receber JWT
- POST /api/auth/refresh — trocar refresh token por novo access token
- GET /api/users — listar usuários (autenticado/administrador)
- GET /api/users/{id} — obter dados do usuário
- PUT /api/users/{id} — atualizar usuário
- DELETE /api/users/{id} — remover usuário
- GET /api/profile — obter perfil do usuário autenticado

Obs.: os endpoints concretos, verbos e payloads devem ser verificados nos controllers do projeto (pasta `Controllers` ou `API`). Caso queira, posso gerar automaticamente a lista de endpoints a partir do código.

## Exemplos de requisição
- Login:
  POST /api/auth/login
  Body (JSON exemplo):
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  Response exemplo:
  {
    "accessToken": "eyJhbGci...",
    "refreshToken": "..."
  }

- Requisição protegida:
  GET /api/profile
  Headers:
    Authorization: Bearer <accessToken>
  Response exemplo:
  {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }

Dica: se o repositório inclui um arquivo `.http` (ex.: `userApi.http`), abra-o no VS Code com a extensão REST Client para testes rápidos.

## Integrações com outros serviços
- A API pode registrar `AddHttpClient()` para chamar serviços externos (ex.: WalletAPI, NotificationAPI, User Management).
- Verifique se há integrações via mensageria (RabbitMQ, Kafka) nas camadas de Infrastructure/Application.
- Para autenticação centralizada, a API pode delegar validação de credenciais a um Identity Provider (ex.: IdentityServer, Auth0).

## Observações / Known Issues
- Não deixe chaves JWT ou strings de conexão em texto plano no repositório.
- Habilite validação de issuer/audience em produção.
- Se o projeto usa arquivos de banco (SQLite) no repositório, considere removê-los e usar migrations.
- Verifique políticas de CORS se a API for consumida por front-ends hospedados em domínios diferentes.
