public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;

    public HistoryService(IHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

     public HistoryDTO RegisterHistory(HistoryDTO historyDto)
    {

        var history = new History 
        {
            Datetime = historyDto.Datetime, 
            Value = historyDto.Value
        };
        _historyRepository.Add(history);

        return new HistoryDTO
        {
            Datetime = history.Datetime,
            Value = history.Value
        };
    }

    public HistoryDTO? GetHistoryDetails(int id)
    {
        var history = _historyRepository.GetById(id);
        return history != null ? new HistoryDTO 
        { 
            Datetime = history.Datetime, 
            Value = history.Value
        } : null;
    }

    public List<HistoryDTO> GetAllHistorys()
    {
        return _historyRepository.ListAll().Select(history => new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime, 
            Value = history.Value
        }).ToList();
    }

}