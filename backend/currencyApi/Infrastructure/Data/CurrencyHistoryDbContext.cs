using Microsoft.EntityFrameworkCore;

public class CurrencyDbContext : DbContext
{
    public CurrencyDbContext(DbContextOptions<CurrencyDbContext> options) : base(options) { }
    public DbSet<Currency> Currencys { get; set; }
}
public class HistoryDbContext : DbContext
{
    public HistoryDbContext(DbContextOptions<HistoryDbContext> options) : base(options) { }
    public DbSet<History> Historys { get; set; }

}