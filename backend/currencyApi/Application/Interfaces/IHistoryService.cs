public interface IHistoryService
{
    HistoryDTO RegisterHistory(HistoryDTO historyDto);
    HistoryDTO? GetHistoryDetails(int id);
    List<HistoryDTO> GetAllHistorys();
}