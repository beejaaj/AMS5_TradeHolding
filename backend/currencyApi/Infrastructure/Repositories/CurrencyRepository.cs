using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CurrencyAPI.Domain.Entities;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.Infrastructure.Data;
using CurrencyAPI.API.DTOs;

namespace CurrencyAPI.Infrastructure.Repositories
{

    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly AppDbContext _context;

        public CurrencyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Currency?> GetCurrencyDetailsAsync(Guid id)
        {
            return await _context.Currencies
                .Include(c => c.Histories)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Currency?> GetBySymbolAsync(string symbol)
        {
            return await _context.Currencies
                .Include(c => c.Histories)
                .FirstOrDefaultAsync(c => c.Symbol == symbol.ToUpper());
        }

        public async Task<IEnumerable<Currency>> GetAllCurrencyAsync()
        {
            return await _context.Currencies
                .Include(c => c.Histories)
                .ToListAsync();
        }

        public async Task RegisterCurrencyAsync(Currency currency)
        {
            await _context.Currencies.AddAsync(currency);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCurrencyAsync(Currency currency)
        {
            _context.Currencies.Update(currency);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCurrencyAsync(Guid id)
        {
            var currency = await _context.Currencies.FindAsync(id);
            if (currency != null)
            {
                _context.Currencies.Remove(currency);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Currencies.AnyAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<History>> GetHistoryAsync(Guid currencyId, DateTime? start, DateTime? end)
        {
            var query = _context.Histories
                .Where(h => h.CurrencyId == currencyId);

            if (start.HasValue)
                query = query.Where(h => h.Date >= start.Value);

            if (end.HasValue)
                query = query.Where(h => h.Date <= end.Value);

            return await query.OrderBy(h => h.Date).ToListAsync();
        }

        public async Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
        {
            var currency = await _context.Currencies
                .Where(c => c.Symbol == symbol.ToUpper())
                .Select(c => new CurrencyWithLastPriceDto
                {
                    Id = c.Id,
                    Symbol = c.Symbol,
                    Name = c.Name,
                    Backing = c.Backing,
                    Reverse = c.Reverse,
                    LastPrice = c.Histories
                        .OrderByDescending(h => h.Date)
                        .Select(h => h.Value)
                        .FirstOrDefault(),
                    LastPriceDate = c.Histories
                        .OrderByDescending(h => h.Date)
                        .Select(h => h.Date)
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            return currency;
        }
    }
}