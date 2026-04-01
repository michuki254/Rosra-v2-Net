using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models;

public class CountryData
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Country { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SNG_total_revenue_pct_gdp { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SNG_grants_subsidies_pct_gdp { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? OSR_pct_gdp { get; set; }

    [Column(TypeName = "decimal(22, 2)")]
    public decimal? GDP_nominal_usd { get; set; }

    public long? Population_total { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? OSR_pc_proxy_usd { get; set; }

    [StringLength(50)]
    public string? Government_Type { get; set; }

    [StringLength(10)]
    public string? OSR_Data_Complete { get; set; }

    [StringLength(50)]
    public string? Income_Level { get; set; }

    [StringLength(50)]
    public string? Income_Group { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SNG_total_rev_pc_usd { get; set; }

    [Column(TypeName = "decimal(18, 9)")]
    public decimal? Revenue_Autonomy { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? OSR_pc_derived_usd { get; set; }

    [StringLength(10)]
    public string? CurrencyCode { get; set; }

    [StringLength(10)]
    public string? CurrencySymbol { get; set; }
}
