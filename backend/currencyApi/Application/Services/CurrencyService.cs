using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Domain.Entities;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.API.DTOs;

namespace CurrencyAPI.Application.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        public async Task RegisterCurrencyAsync(Currency currency)
        {
            await _currencyRepository.RegisterCurrencyAsync(currency);
        }

        public async Task<Currency?> GetCurrencyDetailsAsync(Guid id)
        {
            return await _currencyRepository.GetCurrencyDetailsAsync(id);
        }

        public async Task<IEnumerable<Currency>> GetAllCurrencyAsync()
        {
            return await _currencyRepository.GetAllCurrencyAsync();

        }
        public async Task<Currency?> GetBySymbolAsync(string symbol)
        {
            return await _currencyRepository.GetBySymbolAsync(symbol);
        }


        public async Task UpdateCurrencyAsync(Currency currency)
        {
            await _currencyRepository.UpdateCurrencyAsync(currency);
        }


        public async Task DeleteCurrencyAsync(Guid id)
        {
            await _currencyRepository.DeleteCurrencyAsync(id);
        }

        public async Task<IEnumerable<History>> GetHistoryAsync(Guid currencyId, DateTime? start, DateTime? end)
        {
            return await _currencyRepository.GetHistoryAsync(currencyId, start, end);
        }
        
         public async Task<CurrencyWithLastPriceDto?> GetLastPriceBySymbolAsync(string symbol)
        {
            return await _currencyRepository.GetLastPriceBySymbolAsync(symbol);
        }

    }
}