using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.Application.Services;
using CurrencyAPI.Domain.Interfaces;
using CurrencyAPI.Infrastructure.Repositories;
using CurrencyAPI.Infrastructure.Data;
using CurrencyAPI.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer; // <--- ADICIONE ESTE USING
using Microsoft.IdentityModel.Tokens;              // <--- ADICIONE ESTE USING
using System.Text;                                 // <--- ADICIONE ESTE USING

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Logs e HTTP Client
builder.Services.AddHttpClient();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// 2. Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Injeção de Dependência
builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();
builder.Services.AddScoped<IHistoryRepository, HistoryRepository>();
builder.Services.AddScoped<IHistoryService, HistoryService>();

// 4. Worker de API Externa
builder.Services.AddHostedService<ExternalApiWorker>();

// ==============================================================================
// 5. CONFIGURAÇÃO DE AUTENTICAÇÃO (FALTAVA ISSO AQUI!!!)
// ==============================================================================
// IMPORTANTE: A chave "Jwt:Key" no appsettings.json da CurrencyAPI deve ser IGUAL à da UserAPI
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "palavras123456789giganteparaumcarambaessachave"); 

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
        ValidateIssuer = false,   // Mantendo false para facilitar (igual UserAPI)
        ValidateAudience = false, // Mantendo false para facilitar (igual UserAPI)
        ValidateLifetime = true
    };
});

builder.Services.AddAuthorization(); // <--- Necessário para [Authorize] funcionar

builder.Services.AddControllers();

// 6. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 7. Swagger com Suporte a JWT
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

    // Adiciona o botão de cadeado no Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer",
        Description = "Insira o token JWT aqui"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// 8. Pipeline
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

// 9. ATIVAR OS MIDDLEWARES DE AUTENTICAÇÃO (NESSA ORDEM!)
app.UseAuthentication(); // <--- OBRIGATÓRIO (Quem é você?)
app.UseAuthorization();  // <--- OBRIGATÓRIO (O que você pode fazer?)

app.MapControllers();
app.Run();