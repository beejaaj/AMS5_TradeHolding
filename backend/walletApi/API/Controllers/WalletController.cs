using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWallets(int userId)
        {
            var wallets = await _service.GetUserWalletsAsync(userId);
            return Ok(wallets);
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateWalletDto dto)
        {
            var wallet = await _service.CreateWalletAsync(dto);
            return Ok(wallet);
        }

        [Authorize]
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

        [Authorize]
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

        [Authorize]
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetDetails(int id, [FromQuery] int userId)
        {
            try {
                var data = await _service.GetWalletDetailsAsync(userId, id);
                return Ok(data);
            } catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferDto dto)
        {
            try {
                await _service.TransferAsync(dto);
                return Ok(new { message = "Transferência realizada com sucesso!" });
            } catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

    } 
} 