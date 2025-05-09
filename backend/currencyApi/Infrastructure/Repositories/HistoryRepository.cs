public class HistoryRepository : IHistoryRepository
{
    private readonly HistoryDbContext _context;

    public HistoryRepository(HistoryDbContext context)
    {
        _context = context;
    }

    public void Add(History history)
    {
        _context.Historys.Add(history);
        _context.SaveChanges();
    }

    public History? GetById(int id) => _context.Historys.Find(id);

    public List<History>? ListAll() 
    {
        return _context.Historys?.ToList() ?? new List<History>();
    }
}