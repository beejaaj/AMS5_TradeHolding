using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using CurrencyAPI.Infrastructure.Data;

namespace CurrencyAPI.API.Configurations
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            
            optionsBuilder.UseSqlite("Data Source=Infrastructure/Data/currencydb.sqlite");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}