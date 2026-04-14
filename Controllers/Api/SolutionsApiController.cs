using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using System.Text.Json;

namespace RosraApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolutionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SolutionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/solutions — returns all active cards in the JS-compatible format
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? stream = null,
            [FromQuery] string? gap = null,
            [FromQuery] string? subgroup = null,
            [FromQuery] string? timeline = null)
        {
            var query = _context.SolutionCards.Where(sc => sc.IsActive);

            if (!string.IsNullOrEmpty(stream))
                query = query.Where(sc => sc.Stream == stream);
            if (!string.IsNullOrEmpty(gap))
                query = query.Where(sc => sc.Gap == gap);
            if (!string.IsNullOrEmpty(subgroup))
                query = query.Where(sc => sc.Subgroup == subgroup);
            if (!string.IsNullOrEmpty(timeline))
                query = query.Where(sc => sc.Timeline == timeline);

            var cards = await query.OrderBy(sc => sc.Stream)
                                   .ThenBy(sc => sc.Gap)
                                   .ThenBy(sc => sc.SortOrder)
                                   .ToListAsync();

            // Convert to the JS-compatible format
            var result = cards.Select(CardToJsFormat).ToList();
            return Ok(result);
        }

        /// <summary>
        /// GET /api/solutions/{solutionId} — returns a single card
        /// </summary>
        [HttpGet("{solutionId}")]
        public async Task<IActionResult> GetById(string solutionId)
        {
            var card = await _context.SolutionCards
                .FirstOrDefaultAsync(sc => sc.SolutionId == solutionId && sc.IsActive);

            if (card == null)
                return NotFound(new { error = $"Solution card '{solutionId}' not found" });

            return Ok(CardToJsFormat(card));
        }

        /// <summary>
        /// GET /api/solutions/grouped — returns cards grouped by stream type for frontend window globals
        /// </summary>
        [HttpGet("grouped")]
        public async Task<IActionResult> GetGrouped()
        {
            var cards = await _context.SolutionCards
                .Where(sc => sc.IsActive)
                .OrderBy(sc => sc.SortOrder)
                .ToListAsync();

            var grouped = new
            {
                ptCompliance = cards.Where(c => c.Stream == "Property Tax" && c.Gap == "Compliance").Select(CardToJsFormat),
                ptCoverage = cards.Where(c => c.Stream == "Property Tax" && c.Gap == "Coverage").Select(CardToJsFormat),
                ptValuation = cards.Where(c => c.Stream == "Property Tax" && c.Gap == "Valuation").Select(CardToJsFormat),
                npA = cards.Where(c => c.Subgroup == "A").Select(CardToJsFormat),
                npB = cards.Where(c => c.Subgroup == "B").Select(CardToJsFormat),
                npC = cards.Where(c => c.Subgroup == "C").Select(CardToJsFormat)
            };

            return Ok(grouped);
        }

        /// <summary>
        /// GET /api/solutions/stats — returns card statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var cards = await _context.SolutionCards.Where(sc => sc.IsActive).ToListAsync();

            var stats = new
            {
                total = cards.Count,
                byStream = cards.GroupBy(c => c.Stream).Select(g => new { stream = g.Key, count = g.Count() }),
                byGap = cards.GroupBy(c => c.Gap).Select(g => new { gap = g.Key, count = g.Count() }),
                bySubgroup = cards.Where(c => c.Subgroup != null).GroupBy(c => c.Subgroup).Select(g => new { subgroup = g.Key, count = g.Count() }),
                byTimeline = cards.GroupBy(c => c.Timeline).Select(g => new { timeline = g.Key, count = g.Count() })
            };

            return Ok(stats);
        }

        /// <summary>
        /// Convert a SolutionCard entity to the JS-compatible object format
        /// </summary>
        private static object CardToJsFormat(Models.SolutionCard card)
        {
            object? overview = null;
            object? fullDetails = null;

            try
            {
                if (!string.IsNullOrEmpty(card.OverviewData))
                    overview = JsonSerializer.Deserialize<JsonElement>(card.OverviewData);
            }
            catch { overview = new { }; }

            try
            {
                if (!string.IsNullOrEmpty(card.FullDetailsData))
                    fullDetails = JsonSerializer.Deserialize<JsonElement>(card.FullDetailsData);
            }
            catch { fullDetails = new { }; }

            return new
            {
                solutionId = card.SolutionId,
                stream = card.Stream,
                streamType = card.StreamType,
                subgroup = card.Subgroup,
                gap = card.Gap,
                title = card.Title,
                shortTitle = card.ShortTitle,
                timeline = card.Timeline,
                deliveryDifficulty = card.DeliveryDifficulty,
                politicalSensitivity = card.PoliticalSensitivity,
                category = card.Category,
                sortOrder = card.SortOrder,
                isActive = card.IsActive,
                overview,
                fullDetails
            };
        }
    }
}
