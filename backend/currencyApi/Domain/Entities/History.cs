using System.Text.Json;
using System.Text.Json.Serialization;
using System;

namespace CurrencyAPI.Domain.Entities
{
    public class History
    {
        public Guid Id { get; set; }
        public Guid CurrencyId { get; set; }
        public DateTime Date { get; set; }
        public decimal Value { get; set; }

        // Propriedade de navegação
        [JsonIgnore]
        public Currency Currency { get; set; }

        public History(Guid currencyId, decimal Value, DateTime date)
        {
            Id = Guid.NewGuid();
            SetCurrencyId(currencyId);
            SetPrice(Value);
            SetDate(date);
        }

        private void SetCurrencyId(Guid currencyId)
        {
            if (currencyId == Guid.Empty)
                throw new ArgumentException("CurrencyId is invalid.");

            CurrencyId = currencyId;
        }

        private void SetPrice(decimal value)
        {
            if (value < 0)
                throw new ArgumentException("Value must be greater than or equal to zero.");

            Value = value;
        }

        private void SetDate(DateTime date)
        {
            if (date == default)
                throw new ArgumentException("Date is required.");

            Date = date;
        }
    }
}