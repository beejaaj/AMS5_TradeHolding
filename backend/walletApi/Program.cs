using Microsoft.EntityFrameworkCore;
using walletApi.Application.Services;
using walletApi.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// DB SQLite
builder.Services.AddDbContext<WalletDbContext>(opt => 
    opt.UseSqlite("Data Source=wallet.db"));

// Services (Sem MyMiniBroker)
builder.Services.AddHttpClient();
builder.Services.AddScoped<WalletService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();