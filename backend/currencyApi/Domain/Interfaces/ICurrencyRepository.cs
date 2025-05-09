public interface ICurrencyRepository
{
    void Add(Currency currency);
    Currency? GetById(int id);
    List<Currency>? ListAll();
    void Update(Currency currency);
    void Delete(int id);
}