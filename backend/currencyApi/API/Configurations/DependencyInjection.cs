using Microsoft.EntityFrameworkCore;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Application.Services;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.Infrastructure.Repositories;
using CurrencyAPI.Infrastructure.Data;
using CurrencyAPI.Infrastructure.Services;
using CurrencyAPI.API.Configurations;
// using CurrencyAPI.API.Extensions;


namespace CurrencyAPI.API.Configurations
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ICurrencyRepository, CurrencyRepository>();
            services.AddScoped<ICurrencyService, CurrencyService>();

            services.AddScoped<IHistoryRepository, HistoryRepository>();
            services.AddScoped<IHistoryService, HistoryService>();

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite("Data Source=Infrastructure/Data/currencydb.sqlite"));

            services.AddHttpClient(); 
            services.AddHostedService<ExternalApiWorker>(); 


            return services;
        }
    }
}
