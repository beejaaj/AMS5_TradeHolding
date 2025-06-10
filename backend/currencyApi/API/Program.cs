using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Application.Services;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.Infrastructure.Repositories;
using CurrencyAPI.Infrastructure.Data;
using CurrencyAPI.Infrastructure.Services;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);
// ⛓ Adiciona o DbContext com a conexão (ajuste conforme seu banco de dados)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔌 Injeção de dependência para Repository e Service
builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();

builder.Services.AddScoped<IHistoryRepository, HistoryRepository>();
builder.Services.AddScoped<IHistoryService, HistoryService>();

builder.Services.AddHostedService<ExternalApiWorker>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Currency API",
        Version = "v1",
        Description = "API para gerenciamento de moedas",
        Contact = new OpenApiContact
        {
            Name = "João Perez",
            Email = "joao.saraiva@fatec.sp.gov.br"
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Currency API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.MapControllers();
app.Run();
