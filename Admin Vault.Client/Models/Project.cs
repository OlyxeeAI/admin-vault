using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Vault.Client.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public int KeyCount { get; set; }

    [NotMapped]
    public int DocCount { get; set; }

    public string Initials
    {
        get
        {
            if (string.IsNullOrWhiteSpace(Name)) return "?";
            var parts = Name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 1)
                return parts[0].Length > 1 ? parts[0][..2].ToUpperInvariant() : parts[0].ToUpperInvariant();
            return $"{char.ToUpperInvariant(parts[0][0])}{char.ToUpperInvariant(parts[1][0])}";
        }
    }

    public string AccentColor
    {
        get
        {
            var palette = new[] { "#4f46e5", "#0891b2", "#059669", "#d97706", "#db2777", "#7c3aed", "#2563eb", "#dc2626" };
            int hash = Math.Abs((Name ?? string.Empty).GetHashCode());
            return palette[hash % palette.Length];
        }
    }
}
