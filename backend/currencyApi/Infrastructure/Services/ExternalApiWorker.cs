using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Text.Json;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.API.DTOs;
using CurrencyAPI.Application.Mappers;


namespace CurrencyAPI.Infrastructure.Services
{
    public class ExternalApiWorker : BackgroundService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IServiceProvider _services;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(10);
        private readonly string _cryptoPricesUrl;

        public ExternalApiWorker(IHttpClientFactory httpClientFactory, IConfiguration configuration, IServiceProvider services)
        {
            _httpClientFactory = httpClientFactory;
            _services = services;
            _cryptoPricesUrl = configuration["ExternalApi:CryptoPricesUrl"];
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Serviço de consulta de criptomoedas iniciado.");

            var client = _httpClientFactory.CreateClient();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _services.CreateScope();
                    var currencyService = scope.ServiceProvider.GetRequiredService<ICurrencyService>();
                    var historyService = scope.ServiceProvider.GetRequiredService<IHistoryService>();

                    var currencies = await currencyService.GetAllCurrencyAsync();


                    foreach (var currency in currencies)
                    {
                        try
                        {
                            if (currency.Symbol != currency.Backing)
                            {
                                var currencyUrl = "";
                                if (currency.Reverse)
                                {
                                    currencyUrl = $"{_cryptoPricesUrl}?symbol={currency.Backing}{currency.Symbol}";
                                }
                                else
                                {
                                    currencyUrl = $"{_cryptoPricesUrl}?symbol={currency.Symbol}{currency.Backing}";
                                }
                                Console.WriteLine($"Consultando moeda {currency.Symbol} - URL: {currencyUrl}");
                                

                                var response = await client.GetAsync(currencyUrl, stoppingToken);

                                if (response.IsSuccessStatusCode)
                                {
                                    var content = await response.Content.ReadAsStringAsync(stoppingToken);
                                    var apiResponse = JsonSerializer.Deserialize<CryptoApiResponseDto>(content);

                                    var historyDto = new HistoryDTO
                                    {
                                        CurrencyId = currency.Id,
                                        Value = decimal.Parse(apiResponse.Price),
                                        Date = DateTime.UtcNow
                                    };

                                    await historyService.RegisterHistoryAsync(historyDto.ToEntity());

                                    // Console.WriteLine($"[{DateTime.Now}] Preços de Cripto: {JsonSerializer.Serialize(historyDto)}");
                                }
                                else
                                {
                                    Console.WriteLine($"Erro ao consultar API: {response.StatusCode}");
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Erro durante a requisição: {ex.Message}");
                        }
                    }
                }
                catch (Exception ex)
                {
                     Console.WriteLine($"Erro no worker de consulta à API externa {ex.Message}");
                }

                await Task.Delay(_interval, stoppingToken);
            }

            Console.WriteLine("Serviço de consulta de criptomoedas finalizado.");
        }
    }
}




// using Microsoft.Extensions.Hosting;
// using Microsoft.Extensions.Logging;
// using Microsoft.Extensions.Configuration;
// using System.Net.Http;
// using System.Threading;
// using System.Threading.Tasks;
// using System.Text.Json;
// using CurrencyAPI.Application.Interfaces;
// using CurrencyAPI.API.DTOs;
// using CurrencyAPI.Application.Mappers;
// using System;

// namespace CurrencyAPI.Infrastructure.Services
// {
//     public class ExternalApiWorker : BackgroundService
//     {
//         private const int IntervalSeconds = 10;
//         private readonly IHttpClientFactory _httpClientFactory;
//         private readonly string _cryptoPricesUrl;
//         private readonly ILogger<ExternalApiWorker> _logger;

//         public ExternalApiWorker(
//             IHttpClientFactory httpClientFactory,
//             IConfiguration configuration,
//             ILogger<ExternalApiWorker> logger)
//         {
//             _httpClientFactory = httpClientFactory;
//             _cryptoPricesUrl = configuration["ExternalApi:CryptoPricesUrl"];
//             _logger = logger;
//         }

//         protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//         {
//             _logger.LogInformation("Serviço de consulta de criptomoedas iniciado.");

//             var client = _httpClientFactory.CreateClient();

//             while (!stoppingToken.IsCancellationRequested)
//             {
//                 try
//                 {
//                     var currencyUrl = _cryptoPricesUrl + "?symbol=ETHBTC";
//                     var response = await client.GetAsync(currencyUrl, stoppingToken);

//                     if (response.IsSuccessStatusCode)
//                     {
//                         var content = await response.Content.ReadAsStringAsync(stoppingToken);
//                         _logger.LogInformation($"[{DateTime.Now}] Preços de Cripto: {content}");
//                     }
//                     else
//                     {
//                         _logger.LogWarning($"Erro ao consultar API: {response.StatusCode}");
//                     }
//                 }
//                 catch (Exception ex)
//                 {
//                     _logger.LogError(ex, "Erro durante a requisição");
//                 }

//                 await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), stoppingToken);
//             }

//             _logger.LogInformation("Serviço de consulta de criptomoedas finalizado.");
//         }
//     }
// }