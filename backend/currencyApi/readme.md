# CurrencyAPI

## Identificação

CurrencyAPI fornece funcionalidades relacionadas a moedas e cotações. A API consome fontes externas de preços (ex.: Binance) e mantém um banco de dados SQLite local para persistência de dados. A configuração de autenticação via JWT está presente em appsettings.json (chave, issuer e audience).

## Stack e dependências

- Linguagem / Runtime: C# / .NET
- Banco: SQLite (arquivo em Infrastructure/Data/currencydb.sqlite conforme ConnectionStrings)
- Consumo de APIs externas: HttpClient (URLs configuradas em ExternalApi no appsettings.json)
- Autenticação: JWT (configurado via seção "Jwt" em appsettings.json — contém Key, Issuer e Audience)
- Logging: configurações em appsettings.json (ex.: nível para CurrencyAPI.Infrastructure.Services)
- Observações de configuração:
  - JWT: Key padrão está presente em appsettings.json ("palavras123456789giganteparaumcarambaessachave") — deve ser substituída por segredo seguro em produção.
  - ConnectionStrings aponta para "Infrastructure/Data/currencydb.sqlite" (caminho relativo dentro do projeto).
  - Endpoints externos configurados:
    - CryptoPricesUrl: https://api.binance.com/api/v3/ticker/price
    - CryptoPrices24hrUrl: https://api.binance.com/api/v3/ticker/24hr?symbol=ETHBTC

## Instruções de execução local

Pré-requisitos:
- .NET SDK compatível instalado
- (Opcional) Docker

Executando localmente:
- Restaurar dependências:
  dotnet restore
- Executar:
  dotnet run

A aplicação expõe controladores (pasta API) e usará as configurações presentes em appsettings.json. Verifique a saída do dotnet run para a URL/porta onde a aplicação ficará disponível.

Executando com Docker:
- Build:
  docker build -t currencyapi .
- Run:
  docker run -p 8080:8080 currencyapi

(Observação: a string de conexão é relativa — ajuste volumes/mounts ao rodar em container para persistir o arquivo SQLite.)

## Endpoints principais

- As rotas concretas estão implementadas nos controllers dentro da pasta API. Para exemplos rápidos, veja o arquivo currencyApi.http presente no repositório.
- Para chamadas que exigem autenticação, utilize o header:
  Authorization: Bearer <token>
- Endpoints relacionados a cotações provavelmente consultam os URLs configurados em ExternalApi e/ou retornam dados persistidos no banco SQLite.

## Exemplos de Requisição/Resposta

Exemplo genérico de requisição para obter preços (adapte conforme controllers reais):
- GET /api/currency/prices
- Headers:
  - Authorization: Bearer eyJ...
- Response (exemplo):
  {
    "symbol": "BTCUSDT",
    "price": "56000.00"
  }

Para exemplos concretos e payloads, abra currencyApi.http ou inspecione os controllers na pasta API.

## Integrações com outros serviços

- Consome APIs externas para preços (ex.: Binance) conforme URLs em appsettings.json.
- Persiste dados em SQLite (Infrastructure/Data/currencydb.sqlite).
- Usa JWT para autenticação; Issuer e Audience estão definidos em appsettings.json (Issuer = "fatec", Audience = "ams5").
- Possível integração interna via camadas Application/Infrastructure (ver pastas correspondentes para serviços e repositórios).

## Observações / Known Issues

- A chave JWT padrão em appsettings.json é insegura. Substitua por um segredo forte via variáveis de ambiente ou provider de segredo em produção.
- A connection string do SQLite usa caminho relativo; em ambientes de container/pipeline ajuste volume/mount para persistência e para garantir que o arquivo exista.
- Valide comportamento de retry/timeout ao consumir APIs externas (Binance) e trate possíveis falhas de rede.
- Verifique se migrations/seeders (pasta Migrations) foram aplicados quando necessário; o banco SQLite fornecido pode conter dados de exemplo.
- Para rotas e exemplos reais, consulte os controllers na pasta API e o arquivo currencyApi.http.
