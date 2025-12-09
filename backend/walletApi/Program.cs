using Microsoft.EntityFrameworkCore;
using walletApi.Application.Services;
using walletApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer; // Adicionar
using Microsoft.IdentityModel.Tokens; // Adicionar
using System.Text; // Adicionar

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar a mesma Chave que está no appsettings da UserApi e Gateway
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, // O Gateway já validou, mas é bom manter coerência
        ValidateAudience = false
    };
});

builder.Services.AddDbContext<WalletDbContext>(opt => 
    opt.UseSqlite("Data Source=wallet.db"));

builder.Services.AddHttpClient(); // Necessário para a Wallet falar com a CurrencyApi
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

app.UseAuthentication(); // <--- OBRIGATÓRIO: Adicione antes do Authorization
app.UseAuthorization();

app.MapControllers();
app.Run();