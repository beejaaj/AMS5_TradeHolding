using Microsoft.AspNetCore.Mvc;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.API.DTOs;
using CurrencyAPI.Domain.Entities;

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
            var currency = new Currency(dto.Symbol, dto.Description, dto.Name, dto.Status, dto.Backing);
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
                Backing = currency.Backing
            });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateCurrency(Guid id, [FromBody] CurrencyDTO dto)
        {
            var existing = await _currencyService.GetCurrencyDetailsAsync(id);
            if (existing == null) return NotFound();

            var updated = new Currency(dto.Symbol, dto.Description, dto.Name, dto.Status, dto.Backing);
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
    }
}