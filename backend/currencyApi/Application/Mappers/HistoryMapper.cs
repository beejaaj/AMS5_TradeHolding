using CurrencyAPI.Domain.Entities;
using CurrencyAPI.API.DTOs;

namespace CurrencyAPI.Application.Mappers
{

    public static class HistoryMapper
    {
        public static History ToEntity(this HistoryDTO dto)
        {
            return new History(
                dto.CurrencyId,
                dto.Value,
                dto.Date
            );
        }
    }

}