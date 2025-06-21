using System;
namespace CurrencyAPI.API.DTOs
{
    public class HistoryDTO
    {
        public Guid Id { get; set; }
        public Guid CurrencyId { get; set; }
        public DateTime Date { get; set; }
        public decimal Value { get; set; }
    }
}