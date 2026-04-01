using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models;

[Table("DB_Frontiers")]
public class Frontier
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Income_Level { get; set; } = string.Empty;

    [StringLength(50)]
    public string? Government_Type { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? SNG_total_rev_pc_frontier { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? OSR_pc_frontier { get; set; }

    [Column(TypeName = "decimal(18, 9)")]
    public decimal? Revenue_Autonomy_frontier { get; set; }
}
