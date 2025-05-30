using Microsoft.AspNetCore.Mvc;
using CurrencyAPI.Application.Interfaces;
using CurrencyAPI.API.DTOs;
using CurrencyAPI.Domain.Entities;

namespace CurrencyAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterHistory([FromBody] HistoryDTO dto)
        {
            var history = new History(dto.CurrencyId, dto.Value, dto.Date);
            await _historyService.RegisterHistoryAsync(history);
            return Created("", dto);
        }

        [HttpGet("{currencyId:guid}")]
        public async Task<IActionResult> GetByCurrency(Guid currencyId)
        {
            var histories = await _historyService.GetCurrencyDetailsAsync(currencyId);
            var result = histories.Select(h => new HistoryDTO
            {
                Id = h.Id,
                CurrencyId = h.CurrencyId,
                Value = h.Value,
                Date = h.Date
            });

            return Ok(result);
        }

        [HttpGet("{currencyId:guid}/range")]
        public async Task<IActionResult> GetByDateRange(Guid currencyId, [FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var histories = await _historyService.GetByDateRangeAsync(currencyId, from, to);
            var result = histories.Select(h => new HistoryDTO
            {
                Id = h.Id,
                CurrencyId = h.CurrencyId,
                Value = h.Value,
                Date = h.Date
            });

            return Ok(result);
        }

        
        
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteHistory(Guid id)
        {
            await _historyService.DeleteHistoryAsync(id);
            return NoContent();
        }
    }
}