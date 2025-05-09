public class GetHistoryDetailsUseCase
{
    private readonly IHistoryService _historyService;

    public GetHistoryDetailsUseCase(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    public HistoryDTO? Execute(int id) => _historyService.GetHistoryDetails(id);
}