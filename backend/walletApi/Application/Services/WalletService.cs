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
                throw new Exception($"Saldo insuficiente. Disponível: {sourceWallet.Balance}");

            string targetCurrency = dto.ToCurrency.ToUpper(); 
            string sourceCurrency = sourceWallet.CurrencySymbol.ToUpper();

            decimal priceFrom = await GetRealPriceAsync(sourceCurrency);
            decimal priceTo = await GetRealPriceAsync(targetCurrency);

            if (priceFrom <= 0) throw new Exception($"Preço inválido ou não encontrado para a moeda de origem: {sourceCurrency}");
            if (priceTo <= 0) throw new Exception($"Preço inválido ou não encontrado para a moeda de destino: {targetCurrency}");

            decimal totalValueInUsd = dto.Amount * priceFrom;
            decimal finalAmount = totalValueInUsd / priceTo;

            if (finalAmount <= 0) throw new Exception("O valor da troca resultou em zero. Verifique a quantidade.");

            var destWallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == dto.UserId && w.CurrencySymbol == targetCurrency);

            if (destWallet == null)
            {
                Console.WriteLine($"[WALLET] Criando nova carteira para {targetCurrency}...");
                destWallet = new Wallet
                {
                    UserId = dto.UserId,
                    Name = $"Carteira {targetCurrency}",
                    CurrencySymbol = targetCurrency, 
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
                Description = $"Troca {sourceCurrency} -> {targetCurrency}",
                Amount = -dto.Amount,
                CurrencySymbol = sourceCurrency
            });

            _context.Transactions.Add(new Transaction
            {
                UserId = dto.UserId,
                Type = "TRADE_IN",
                Description = $"Recebido de troca {sourceCurrency}",
                Amount = finalAmount,
                CurrencySymbol = targetCurrency
            });

            await _context.SaveChangesAsync();
        }

        private async Task<decimal> GetRealPriceAsync(string symbol)
        {
            if (string.Equals(symbol, "USD", StringComparison.OrdinalIgnoreCase) || 
                string.Equals(symbol, "USDT", StringComparison.OrdinalIgnoreCase)) 
                return 1m;

            try
            {
                var url = "http://localhost:5266/Currency";
                
                var response = await _http.GetAsync(url);
                if (!response.IsSuccessStatusCode) 
                    throw new Exception($"Erro HTTP {response.StatusCode} ao buscar cotação."); // Lança erro em vez de retornar 0

                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var currencies = JsonSerializer.Deserialize<List<CurrencyResponse>>(json, options);

                var currency = currencies?.FirstOrDefault(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));

                if (currency != null && currency.Histories != null && currency.Histories.Any())
                {
                    decimal price = currency.Histories.OrderByDescending(h => h.Date).First().Value;
                    if (price > 100000000) price = price / 100000000m;
                    return price;
                }
                else 
                {
                    throw new Exception($"Sem histórico de preço para {symbol}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao obter preço: {ex.Message}");
                throw; 
            }
        }
        public async Task<object> GetWalletDetailsAsync(int userId, int walletId)
        {
            var wallet = await _context.Wallets.FindAsync(walletId);

            if (wallet == null || wallet.UserId != userId)
                throw new Exception("Carteira não encontrada ou acesso negado.");

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.CurrencySymbol == wallet.CurrencySymbol)
                .OrderByDescending(t => t.Id) 
                .ToListAsync();

            return new { Wallet = wallet, Transactions = transactions };
        }

        public async Task TransferAsync(TransferDto dto)
        {
            var sourceWallet = await _context.Wallets.FindAsync(dto.FromWalletId);
            if (sourceWallet == null || sourceWallet.UserId != dto.UserId)
                throw new Exception("Carteira de origem inválida.");

            if (sourceWallet.Balance < dto.Amount)
                throw new Exception("Saldo insuficiente.");

            var destWallet = await _context.Wallets.FindAsync(dto.ToWalletId);
            if (destWallet == null)
                throw new Exception($"Carteira de destino (ID: {dto.ToWalletId}) não encontrada.");

            if (sourceWallet.CurrencySymbol != destWallet.CurrencySymbol)
                throw new Exception($"Não é possível transferir {sourceWallet.CurrencySymbol} para uma carteira de {destWallet.CurrencySymbol}.");

            if (sourceWallet.Id == destWallet.Id)
                throw new Exception("Você não pode transferir para a mesma carteira.");

            sourceWallet.Balance -= dto.Amount;
            destWallet.Balance += dto.Amount;

            _context.Transactions.Add(new Transaction
            {
                UserId = dto.UserId,
                Type = "TRANSFER_OUT",
                Description = $"Envio para Carteira #{destWallet.Id}",
                Amount = -dto.Amount,
                CurrencySymbol = sourceWallet.CurrencySymbol
            });

            _context.Transactions.Add(new Transaction
            {
                UserId = destWallet.UserId, 
                Type = "TRANSFER_IN",
                Description = $"Recebido da Carteira #{sourceWallet.Id}",
                Amount = dto.Amount,
                CurrencySymbol = destWallet.CurrencySymbol
            });

            await _context.SaveChangesAsync();
        }

        private class CurrencyResponse { public string Symbol { get; set; } public List<HistoryResponse> Histories { get; set; } }
        private class HistoryResponse { public decimal Value { get; set; } public DateTime Date { get; set; } }
    }
}