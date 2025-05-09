public class CurrencyRepository : ICurrencyRepository
{
    private readonly CurrencyDbContext _context;

    public CurrencyRepository(CurrencyDbContext context)
    {
        _context = context;
    }

    public void Add(Currency currency)
    {
        _context.Currencys.Add(currency);
        _context.SaveChanges();
    }

    public Currency? GetById(int id) => _context.Currencys.Find(id);

    public List<Currency>? ListAll() 
    {
        return _context.Currencys?.ToList() ?? new List<Currency>();
    }
    public void Update(Currency currency)
    {
        _context.Currencys.Update(currency);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var currency = _context.Currencys.Find(id);
        if (currency != null)
        {
            _context.Currencys.Remove(currency);
            _context.SaveChanges();
        }
    }
}