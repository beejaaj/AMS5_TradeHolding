using currencyApi.Domain.Enum;
public class CurrencyDTO
{
    public int Id {get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public BackingType Backing { get; set; }
    public bool Status { get; set; }    
}