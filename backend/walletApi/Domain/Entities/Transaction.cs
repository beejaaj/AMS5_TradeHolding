using System.ComponentModel.DataAnnotations.Schema;

namespace walletApi.Domain.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; } // "DEPOSIT", "TRADE"
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string CurrencySymbol { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}