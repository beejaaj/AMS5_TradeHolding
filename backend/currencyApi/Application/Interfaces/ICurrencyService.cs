using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CurrencyAPI.Domain.Entities;
using CurrencyAPI.API.DTOs;

namespace CurrencyAPI.Application.Interfaces
{
    public interface ICurrencyService
    {
        Task<IEnumerable<Currency>> GetAllCurrencyAsync();
        Task<Currency?> GetCurrencyDetailsAsync(Guid id);
        Task<Currency?> GetBySymbolAsync(string symbol);
        Task RegisterCurrencyAsync(Currency currency);
        Task UpdateCurrencyAsync(Currency currency);
        Task DeleteCurrencyAsync(Guid id);
        Task<IEnumerable<History>> GetHistoryAsync(Guid currencyId, DateTime? start, DateTime? end);
        Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol);
    }
}