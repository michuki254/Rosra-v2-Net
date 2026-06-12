using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models;

public class PeerSNG
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Country Code (ISO 3166-1 alpha-3, e.g., "KEN" for Kenya)
    /// Default is "KEN" for backward compatibility with existing data
    /// </summary>
    [StringLength(3)]
    public string CountryCode { get; set; } = "KEN";

    /// <summary>
    /// Subnational Government name
    /// </summary>
    [Required]
    [StringLength(100)]
    public string SNG { get; set; } = string.Empty;

    /// <summary>
    /// Own Source Revenue (full KES value)
    /// </summary>
    [Column(TypeName = "decimal(28, 2)")]
    public decimal OSR { get; set; }

    /// <summary>
    /// Gross County Product (full KES value)
    /// </summary>
    [Column(TypeName = "decimal(28, 2)")]
    public decimal GCP { get; set; }

    /// <summary>
    /// Population (KNBS projection)
    /// </summary>
    public long Population { get; set; }

    /// <summary>
    /// Include flag (1 = include, 0 = exclude)
    /// </summary>
    public bool Include { get; set; }

    /// <summary>
    /// Government band from the preloaded dataset: "Local-admin / municipal"
    /// or "Regional / state / province". Peers are compared within the same
    /// band (matters for countries with both, e.g. the Philippines).
    /// Null for legacy/user-uploaded rows.
    /// </summary>
    [StringLength(50)]
    public string? Band { get; set; }

    /// <summary>
    /// True when the source dataset flags the row for cautious interpretation
    /// (e.g. Indian states, whose OSR includes state-level revenue powers).
    /// </summary>
    public bool Watchlist { get; set; }

    /// <summary>
    /// ISO currency code of OSR/GCP values ("USD" for the 2024 preloaded
    /// dataset). Null means legacy local-currency data.
    /// </summary>
    [StringLength(3)]
    public string? Currency { get; set; }

    /// <summary>
    /// Calculated: OSR / GCP (fiscal effort ratio)
    /// </summary>
    [NotMapped]
    public decimal? Mult => GCP != 0 ? OSR / GCP : null;

    /// <summary>
    /// Calculated: Returns Mult if Include=true and Mult > 0, otherwise null
    /// </summary>
    [NotMapped]
    public decimal? ValidMult => Include && Mult.HasValue && Mult.Value > 0 ? Mult.Value : null;

    /// <summary>
    /// Calculated: OSR per capita (OSR / Population)
    /// </summary>
    [NotMapped]
    public decimal? OSRPerCapita => Population > 0 ? OSR / Population : null;
}
