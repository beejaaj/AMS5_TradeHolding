using System.ComponentModel.DataAnnotations.Schema;

namespace walletApi.Domain.Entities
{
    public class Wallet
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        // Nome para o usuário identificar (ex: "Investimento", "Trade Principal")
        public string Name { get; set; } = string.Empty; 
        
        // A moeda desta carteira (ex: "BTC", "USD")
        public string CurrencySymbol { get; set; } = string.Empty; 
        
        [Column(TypeName = "decimal(18, 8)")]
        public decimal Balance { get; set; }
    }
}