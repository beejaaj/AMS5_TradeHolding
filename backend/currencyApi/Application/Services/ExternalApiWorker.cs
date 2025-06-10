using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace CurrencyAPI.Infrastructure.Services
{
    public class ExternalApiWorker : BackgroundService
    {
        private const int IntervalSeconds = 10;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _cryptoPricesUrl;
        private readonly ILogger<ExternalApiWorker> _logger;

        public ExternalApiWorker(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ExternalApiWorker> logger)
        {
            _httpClientFactory = httpClientFactory;
            _cryptoPricesUrl = configuration["ExternalApi:CryptoPricesUrl"];
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de consulta de criptomoedas iniciado.");

            var client = _httpClientFactory.CreateClient();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var currencyUrl = _cryptoPricesUrl + "?symbol=ETHBTC";
                    var response = await client.GetAsync(currencyUrl, stoppingToken);

                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync(stoppingToken);
                        _logger.LogInformation($"[{DateTime.Now}] Preços de Cripto: {content}");
                    }
                    else
                    {
                        _logger.LogWarning($"Erro ao consultar API: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro durante a requisição");
                }

                await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), stoppingToken);
            }

            _logger.LogInformation("Serviço de consulta de criptomoedas finalizado.");
        }
    }
}