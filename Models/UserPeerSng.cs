using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models;

/// <summary>
/// A peer local government entered by a user for the top-down within-country
/// analysis. Stored against the user (and, where known, the report) so it is
/// reusable across the user's reports — a personal peer library.
///
/// This is deliberately separate from <see cref="PeerSNG"/> (the admin-managed
/// global reference dataset): user data never lands in Peers_SNG.
/// </summary>
public class UserPeerSng
{
    [Key]
    public int Id { get; set; }

    /// <summary>Owner (AspNetUsers Id). The library is keyed by this + CountryCode.</summary>
    [Required]
    [StringLength(450)]
    public string UserId { get; set; } = string.Empty;

    /// <summary>Optional report this set was last used in (best-effort association).</summary>
    public int? ReportId { get; set; }

    [StringLength(3)]
    public string CountryCode { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Sng { get; set; } = string.Empty;

    [Column(TypeName = "decimal(28, 2)")]
    public decimal Osr { get; set; }

    [Column(TypeName = "decimal(28, 2)")]
    public decimal Gcp { get; set; }

    public long Population { get; set; }

    public bool Include { get; set; } = true;

    [StringLength(50)]
    public string? Band { get; set; }

    [StringLength(3)]
    public string? Currency { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
