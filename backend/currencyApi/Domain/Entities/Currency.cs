using currencyApi.Domain.Enum;
using System;
using System.Collections.Generic;

namespace CurrencyAPI.Domain.Entities
{
    public class Currency
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Backing { get; set; }
        public string Status { get; set; }
        public bool Reverse { get; private set; } = false;


        // Relacionamento: 1 Currency tem N Histories
        private readonly List<History> _histories = new();
        public IReadOnlyCollection<History> Histories => _histories.AsReadOnly();

        public Currency(string symbol, string description, string name, string status, string backing, bool reverse = false)
        {
            Id = Guid.NewGuid();
            SetSymbol(symbol);
            SetDescription(description);
            SetName(name);
            SetStatus(status);
            SetBacking(backing);
            SetReverse(reverse);
        }

        public void RegisterAddHistory(History history)
        {
            if (history == null)
                throw new ArgumentNullException(nameof(history));

            if (history.CurrencyId != Id)
                throw new InvalidOperationException("History currency ID mismatch.");

            _histories.Add(history);
        }

        private void SetSymbol(string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
                throw new ArgumentException("Symbol is required.");

            Symbol = symbol.ToUpper();
        }

        private void SetName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name is required.");

            Name = name;
        }

        private void SetBacking(string backing)
        {
            if (string.IsNullOrWhiteSpace(backing))
                throw new ArgumentException("Backing is required.");

            Backing = backing.ToUpper();
        }

        private void SetDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("description is required.");

            Description = description;
        }
        private void SetStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new ArgumentException("status is required.");

            Status = status;
        }
        public void SetReverse(bool reverse)
        {
            Reverse = reverse;
        }
    }
}