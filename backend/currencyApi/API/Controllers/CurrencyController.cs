using Microsoft.AspNetCore.Mvc;
using CurrencyAPI.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using CurrencyAPI.API.DTOs;
using CurrencyAPI.Domain.Entities;
using CurrencyAPI.Infrastructure.Data;

namespace CurrencyAPI.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterCurrency([FromBody] CurrencyDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currency = new Currency(dto.Symbol, dto.Description, dto.Name, dto.Status, dto.Backing, dto.Reverse);
            await _currencyService.RegisterCurrencyAsync(currency);
            return CreatedAtAction(nameof(GetCurrencyDetails), new { id = currency.Id }, dto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCurrency()
        {
            var currencies = await _currencyService.GetAllCurrencyAsync();
            var result = currencies.Select(c => new CurrencyDTO
            {
                Id = c.Id,
                Symbol = c.Symbol,
                Description = c.Description,
                Name = c.Name,
                Status = c.Status,
                Backing = c.Backing,
                Reverse = c.Reverse,
                Histories = c.Histories.Select(h => new HistoryDTO
                {
                    Id = h.Id,
                    CurrencyId = h.CurrencyId,
                    Value = h.Value,
                    Date = h.Date
                }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetCurrencyDetails(Guid id)
        {
            var currency = await _currencyService.GetCurrencyDetailsAsync(id);
            if (currency == null) return NotFound();

            return Ok(new CurrencyDTO
            {
                Id = currency.Id,
                Symbol = currency.Symbol,
                Name = currency.Name,
                Description = currency.Description,
                Status = currency.Status,
                Backing = currency.Backing,
                Reverse = currency.Reverse
            });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateCurrency(Guid id, [FromBody] CurrencyDTO dto)
        {
            var existing = await _currencyService.GetCurrencyDetailsAsync(id);
            if (existing == null) return NotFound();

            var context = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
            context.Entry(existing).State = EntityState.Detached;

            var updated = new Currency(dto.Symbol, dto.Description, dto.Name, dto.Status, dto.Backing, dto.Reverse);
            typeof(Currency).GetProperty("Id")?.SetValue(updated, id);

            await _currencyService.UpdateCurrencyAsync(updated);
            return NoContent();
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteCurrency(Guid id)
        {
            var existing = await _currencyService.GetCurrencyDetailsAsync(id);
            if (existing == null) return NotFound();

            await _currencyService.DeleteCurrencyAsync(id);
            return NoContent();
        }
        

        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory(Guid id, DateTime? start, DateTime? end)
        {
            var exists = await _currencyService.GetCurrencyDetailsAsync(id);
            if (exists == null)
                return NotFound();

            var history = await _currencyService.GetHistoryAsync(id, start, end);
            return Ok(history);
        }

        // GET api/currencies/convert?from=USD&to=EUR&amount=100
        [HttpGet("convert")]
        public async Task<IActionResult> Convert(string from, string to, decimal amount)
        {
            var currencyFrom = await _currencyService.GetLastPriceBySymbolAsync(from);
            var currencyTo = await _currencyService.GetLastPriceBySymbolAsync(to);
            decimal conversionRate = 0;

            if (currencyFrom.Backing == currencyTo.Backing)
            {
                decimal valueFrom = currencyFrom.Symbol == currencyFrom.Backing
                    ? 1 : currencyFrom.Reverse
                        ? 1 / currencyFrom.LastPrice.Value
                        : currencyFrom.LastPrice.Value;

                decimal valueTo = currencyTo.Symbol == currencyTo.Backing
                    ? 1 : currencyTo.Reverse
                        ? 1 / currencyTo.LastPrice.Value
                        : currencyTo.LastPrice.Value;

                conversionRate = valueFrom / valueTo;
            }

            decimal value = amount * conversionRate;

            var ret = new
            {
                From = currencyFrom,
                To = currencyTo,
                Amount = amount,
                Rate = conversionRate,
                Value = value,
            };


            return Ok(ret);
        }
    }
}