# GatewayAPI

## Identificação

GatewayAPI atua como API Gateway do sistema, roteando e expondo endpoints para os serviços internos usando Ocelot. Ele faz autenticação de entrada via JWT (esquema "Bearer") e aplica políticas de CORS amplas para permitir chamadas de qualquer origem.

## Stack e dependências

- Linguagem / Runtime: C# / .NET (projeto preparado para .NET 8 / 9 conforme artefatos no repositório)
- Gateway: Ocelot (configurado via `ocelot.json`)
- Autenticação: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- CORS: política "CorsPolicy" permitindo qualquer origem, cabeçalho e método
- Observações de configuração:
  - A chave JWT é lida de `Configuration["Jwt:Key"]`. Se ausente, a aplicação usa a chave padrão (insegura) definida no código:
    `palavras123456789giganteparaumcarambaessachave`
  - Token validation: ValidateIssuer e ValidateAudience estão desabilitados; ValidateLifetime ativado; ClockSkew = 0.
  - Ocelot é carregado a partir do arquivo `ocelot.json` com reloadOnChange = true (alterações no arquivo são recarregadas durante execução).

## Instruções de execução local

Pré-requisitos:
- .NET SDK compatível instalado (veja o projeto; há um script `dotnet-install.sh` no repositório)
- (Opcional) Docker

Executando localmente:
- Restaurar dependências:
  dotnet restore
- Executar:
  dotnet run

A aplicação usará a configuração padrão do ASP.NET; o endereço e portas aparecem na saída do `dotnet run`.

Executando com Docker:
- Build:
  docker build -t gatewayapi .
- Run:
  docker run -p 8080:8080 gatewayapi

(Observação: Ajuste mapeamento de portas e volumes conforme necessário. O projeto não força uma porta no código mostrado — Kestrel decide a porta padrão — então ajuste o container para mapear a porta correta.)

## Endpoints principais

- O Gateway expõe rotas e regras definidas no `ocelot.json`. Verifique esse arquivo para ver quais caminhos externos são roteados para quais serviços internos (paths, upstream/downstream, re-routes, etc.).
- Para testar rapidamente, consulte `gatewayApi.http` que contém exemplos HTTP prontos.
- Rotas protegidas exigem header Authorization:
  Authorization: Bearer <token>

## Exemplos de Requisição/Resposta

Chamada a rota protegida através do Gateway (exemplo genérico):
- GET /api/somepath (path definido em ocelot.json)
- Headers:
  - Authorization: Bearer eyJ...
- Response (depende do serviço downstream; exemplo genérico):
  {
    "data": "conteúdo retornado pelo serviço interno"
  }

Para ver exemplos concretos das rotas proxied, abra `ocelot.json` ou use `gatewayApi.http`.

## Integrações com outros serviços

- Ocelot encaminha requisições para serviços internos (conforme mapeamento em `ocelot.json`).
- Autenticação é baseada em JWT; o Gateway valida a assinatura do token usando a chave configurada e então repassa ou bloqueia a requisição conforme result.
- O projeto contém `dotnet-install.sh` (script para instalar .NET) e um arquivo `dotnet9.tar.gz` (no repositório, aparentemente vazio), possivelmente relacionados ao ambiente de execução.

## Observações / Known Issues

- A chave JWT padrão definida no código é insegura. Sempre configurar um segredo forte através de `Jwt:Key` em variáveis de ambiente ou configuração externa em produção.
- Validação de issuer/audience está desabilitada — reavalie e configure ValidateIssuer/ValidateAudience conforme a topologia de autenticação em produção.
- CORS está configurado para permitir qualquer origem, cabeçalho e método (policy "CorsPolicy"). Isso facilita desenvolvimento, mas é um risco de segurança em produção.
- `ocelot.json` é a fonte de verdade para rotas do gateway; qualquer alteração deve ser revisada cuidadosamente.
- Ajuste do Docker/hosting: o projeto não força porta fixa no código; garanta que o container exponha a porta correta e que o Kestrel seja configurado conforme necessidade.
- Há um script `dotnet-install.sh` e um artefato `dotnet9.tar.gz` no repositório — revisar o propósito e remover artefatos desnecessários antes de publicar.
