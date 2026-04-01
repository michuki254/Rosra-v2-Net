using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models;

[Table("Country")]
public class Country
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string? Name { get; set; }

    [StringLength(100)]
    public string? Capital { get; set; }

    [StringLength(50)]
    public string? Currency { get; set; }

    [StringLength(100)]
    public string? Region { get; set; }

    [StringLength(100)]
    public string? Subregion { get; set; }

    [Column("Statesname")]
    [StringLength(200)]
    public string? StateName { get; set; }

    [Column("Statesstate_code")]
    [StringLength(20)]
    public string? StateCode { get; set; }

    [Column("Statescity")]
    [StringLength(200)]
    public string? StateCity { get; set; }
}
