using Microsoft.EntityFrameworkCore;
using CurrencyAPI.Domain.Entities;

namespace CurrencyAPI.Infrastructure.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Currency> Currencies { get; set; }
        public DbSet<History> Histories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Symbol).IsRequired().HasMaxLength(10);
                entity.Property(c => c.Description).IsRequired().HasMaxLength(1000);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                // Talvez Precise mudar como vai ser colocado os dois abaixo
                entity.Property(c => c.Status).IsRequired().HasMaxLength(50);
                entity.Property(c => c.Backing).IsRequired().HasMaxLength(100);

                entity.HasMany(c => c.Histories)
                      .WithOne(h => h.Currency)
                      .HasForeignKey(h => h.CurrencyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<History>(entity =>
            {
                entity.HasKey(h => h.Id);
                entity.Property(h => h.Value).IsRequired();
                entity.Property(h => h.Date).IsRequired();
            });
        }
    }
}