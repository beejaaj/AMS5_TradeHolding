using System;
using currencyApi.Domain.Enum;

namespace CurrencyAPI.API.DTOs
{
    public class CurrencyDTO
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; }
        public string Description { get; set; }
        public string Backing { get; set; }
        public string Status { get; set; }
        public List<HistoryDTO> Histories { get; set; } = new();
    }
}