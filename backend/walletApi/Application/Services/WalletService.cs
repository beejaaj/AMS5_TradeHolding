using Microsoft.EntityFrameworkCore;
using walletApi.API.DTOs;
using walletApi.Domain.Entities;
using walletApi.Infrastructure.Data;
using System.Text.Json;

namespace walletApi.Application.Services
{
    public class WalletService
    {
        private readonly WalletDbContext _context;
        private readonly HttpClient _http;

        public WalletService(WalletDbContext context, HttpClient http)
        {
            _context = context;
            _http = http;
        }

        public async Task<List<Wallet>> GetUserWalletsAsync(int userId)
        {
            return await _context.Wallets.Where(w => w.UserId == userId).ToListAsync();
        }

        public async Task<Wallet> CreateWalletAsync(CreateWalletDto dto)
        {
            var existing = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == dto.UserId && w.CurrencySymbol == dto.Currency);
            
            if (existing != null) return existing;

            var wallet = new Wallet
            {
                UserId = dto.UserId,
                Name = dto.Name,
                CurrencySymbol = dto.Currency.ToUpper(),
                Balance = 0
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();
            return wallet;
        }

        public async Task DepositAsync(DepositDto dto)
        {
            var wallet = await _context.Wallets.FindAsync(dto.WalletId);

            if (wallet == null || wallet.UserId != dto.UserId)
                throw new Exception("Carteira não encontrada.");

            wallet.Balance += dto.Amount;

            _context.Transactions.Add(new Transaction
            {
                UserId = dto.UserId,
                Type = "DEPOSIT",
                Description = $"Depósito na carteira {wallet.Name}",
                Amount = dto.Amount,
                CurrencySymbol = wallet.CurrencySymbol
            });

            await _context.SaveChangesAsync();
            Console.WriteLine($"[WALLET] Depósito de {dto.Amount} {wallet.CurrencySymbol}");
        }

        public async Task TradeAsync(TradeDto dto)
        {
            var sourceWallet = await _context.Wallets.FindAsync(dto.FromWalletId);
            if (sourceWallet == null || sourceWallet.UserId != dto.UserId)
                throw new Exception("Carteira de origem inválida.");

            if (sourceWallet.Balance < dto.Amount)
                throw new Exception("Saldo insuficiente.");

            decimal priceFrom = await GetRealPriceAsync(sourceWallet.CurrencySymbol);
            decimal priceTo = await GetRealPriceAsync(dto.ToCurrency);

            if (priceTo == 0) throw new Exception($"Preço inválido para {dto.ToCurrency}.");

            decimal totalValueInUsd = dto.Amount * priceFrom;
            decimal finalAmount = totalValueInUsd / priceTo;

            var destWallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == dto.UserId && w.CurrencySymbol == dto.ToCurrency);

            if (destWallet == null)
            {
                destWallet = new Wallet
                {
                    UserId = dto.UserId,
                    Name = $"Carteira {dto.ToCurrency}",
                    CurrencySymbol = dto.ToCurrency,
                    Balance = 0
                };
                _context.Wallets.Add(destWallet);
            }

            sourceWallet.Balance -= dto.Amount;
            destWallet.Balance += finalAmount;

            _context.Transactions.Add(new Transaction
            {
                UserId = dto.UserId,
                Type = "TRADE",
                Description = $"Troca {sourceWallet.CurrencySymbol} -> {destWallet.CurrencySymbol}",
                Amount = -dto.Amount,
                CurrencySymbol = sourceWallet.CurrencySymbol
            });

            await _context.SaveChangesAsync();
            Console.WriteLine($"[WALLET] Trade realizado: {finalAmount} {dto.ToCurrency}");
        }

        private async Task<decimal> GetRealPriceAsync(string symbol)
        {
            if (string.Equals(symbol, "USD", StringComparison.OrdinalIgnoreCase) || 
                string.Equals(symbol, "USDT", StringComparison.OrdinalIgnoreCase)) 
                return 1m;

            try
            {
                // URL da sua CurrencyAPI
                var url = "http://localhost:5284/api/Currency";
                var response = await _http.GetAsync(url);
                if (!response.IsSuccessStatusCode) return 0;

                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var currencies = JsonSerializer.Deserialize<List<CurrencyResponse>>(json, options);

                var currency = currencies?.FirstOrDefault(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));

                if (currency != null && currency.Histories != null && currency.Histories.Any())
                {
                    decimal price = currency.Histories.OrderByDescending(h => h.Date).First().Value;
                    // Correção temporária para o bug de escala da sua API (valores em trilhões)
                    if (price > 100000000) price = price / 100000000m;
                    return price;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao obter preço: {ex.Message}");
            }
            return 0;
        }

        private class CurrencyResponse { public string Symbol { get; set; } public List<HistoryResponse> Histories { get; set; } }
        private class HistoryResponse { public decimal Value { get; set; } public DateTime Date { get; set; } }
    }
}