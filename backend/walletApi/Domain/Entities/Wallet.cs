using System.ComponentModel.DataAnnotations.Schema;

namespace walletApi.Domain.Entities
{
    public class Wallet
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string Name { get; set; } = string.Empty; 
        
        public string CurrencySymbol { get; set; } = string.Empty; 
        
        [Column(TypeName = "decimal(18, 8)")]
        public decimal Balance { get; set; }
    }
}