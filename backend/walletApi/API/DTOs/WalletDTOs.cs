namespace walletApi.API.DTOs
{
    public record CreateWalletDto(int UserId, string Name, string Currency);

    public record DepositDto(int UserId, int WalletId, decimal Amount);

    public record TradeDto(int UserId, int FromWalletId, string ToCurrency, decimal Amount);

    public record TransferDto(int UserId, int FromWalletId, int ToWalletId, decimal Amount);
}