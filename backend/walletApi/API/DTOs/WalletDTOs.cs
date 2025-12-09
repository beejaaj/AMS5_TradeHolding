namespace walletApi.API.DTOs
{
    // DTO para criar uma nova carteira
    public record CreateWalletDto(int UserId, string Name, string Currency);

    // DTO para depósito (agora pede o ID da carteira específica)
    public record DepositDto(int UserId, int WalletId, decimal Amount);

    // DTO para Trade
    // FromWalletId: De onde sai o dinheiro (ex: carteira de USD)
    // ToCurrency: O que eu quero comprar (ex: "BTC") -> O sistema acha/cria uma carteira BTC para depositar
    public record TradeDto(int UserId, int FromWalletId, string ToCurrency, decimal Amount);
}