public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);
    CurrencyDTO? GetCurrencyDetails(int id);
    List<CurrencyDTO> GetAllCurrencys();
    CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto);
    bool DeleteCurrency(int id);
}