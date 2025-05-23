using Microsoft.AspNetCore.Mvc;

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
    public IActionResult RegisterHistory(HistoryDTO historyDto)
    {
        var result = _historyService.RegisterHistory(historyDto);
        return Ok(result);
    }

    [HttpGet]
    public IActionResult GetAllHistory()
    {
        var historys = _historyService.GetAllHistorys();
        return Ok(historys);
    }

    [HttpGet("{id}")]
    public IActionResult GetHistoryDetails(int id)
    {
        var history = _historyService.GetHistoryDetails(id);
        return history != null ? Ok(history) : NotFound();
    }
}