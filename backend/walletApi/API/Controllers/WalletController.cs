using Microsoft.AspNetCore.Mvc;
using walletApi.API.DTOs;
using walletApi.Application.Services;

namespace walletApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly WalletService _service;

        public WalletController(WalletService service)
        {
            _service = service;
        }

        // Listar todas as carteiras do usuário
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWallets(int userId)
        {
            var wallets = await _service.GetUserWalletsAsync(userId);
            return Ok(wallets);
        }

        // Criar nova carteira (ex: criar uma carteira de poupança em BTC)
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateWalletDto dto)
        {
            var wallet = await _service.CreateWalletAsync(dto);
            return Ok(wallet);
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositDto dto)
        {
            try {
                await _service.DepositAsync(dto);
                return Ok(new { message = "Depósito realizado com sucesso" });
            } catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("trade")]
        public async Task<IActionResult> Trade([FromBody] TradeDto dto)
        {
            try {
                await _service.TradeAsync(dto);
                return Ok(new { message = "Trade realizado com sucesso" });
            } catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}