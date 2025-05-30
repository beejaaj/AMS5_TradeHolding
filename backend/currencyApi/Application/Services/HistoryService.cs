using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Domain.Entities;
using CurrencyAPI.Domain.Interfaces;

namespace CurrencyAPI.Application.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IHistoryRepository _historyRepository;

        public HistoryService(IHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }

        public async Task RegisterHistoryAsync(History history)
        {
            await _historyRepository.RegisterHistoryAsync(history);
        }


        public async Task<IEnumerable<History>> GetCurrencyDetailsAsync(Guid currencyId)
        {
            return await _historyRepository.GetCurrencyDetailsAsync(currencyId);
        }

        public async Task<IEnumerable<History>> GetByDateRangeAsync(Guid currencyId, DateTime from, DateTime to)
        {
            return await _historyRepository.GetByDateRangeAsync(currencyId, from, to);
        }

        public async Task DeleteHistoryAsync(Guid id)
        {
            await _historyRepository.DeleteHistoryAsync(id);
        }
    }
}