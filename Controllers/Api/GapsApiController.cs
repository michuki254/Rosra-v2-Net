using Microsoft.AspNetCore.Mvc;
using RosraApp.Services;

namespace RosraApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GapsController : ControllerBase
    {
        private readonly GapCalculationService _gapService;

        public GapsController()
        {
            _gapService = new GapCalculationService();
        }

        /// <summary>
        /// POST /api/gaps/calculate — validate inputs and calculate gaps server-side
        /// </summary>
        [HttpPost("calculate")]
        public IActionResult Calculate([FromBody] GenericStreamInput input)
        {
            if (input == null)
                return BadRequest(new { errors = new[] { "No input data provided." } });

            var result = _gapService.CalculateGenericStreamGaps(input);

            if (!result.IsValid)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Values);
        }
    }
}
