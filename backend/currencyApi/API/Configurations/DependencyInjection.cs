using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<ICurrencyService, CurrencyService>();
        services.AddScoped<IHistoryRepository, HistoryRepository>();
        services.AddScoped<IHistoryService, HistoryService>();
        services.AddDbContext<CurrencyHistoryDbContext>(options =>
            options.UseSqlite("Data Source=Infrastructure/Data/currencyhistorydb.sqlite"));
        return services;
    }
}