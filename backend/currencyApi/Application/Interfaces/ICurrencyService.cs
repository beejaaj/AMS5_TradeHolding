using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CurrencyAPI.Domain.Entities;

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
    }
}