using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CurrencyAPI.Domain.Entities;

namespace CurrencyAPI.Domain.Interfaces
{
    public interface IHistoryRepository
    {
        Task<IEnumerable<History>> GetAllAsync();
        Task<History?> GetHistoryDetailsAsync(Guid id);
        Task<IEnumerable<History>> GetCurrencyDetailsAsync(Guid currencyId);
        Task<IEnumerable<History>> GetByDateRangeAsync(Guid currencyId, DateTime from, DateTime to);
        Task RegisterHistoryAsync(History history);
        Task DeleteHistoryAsync(Guid id);
    }
}