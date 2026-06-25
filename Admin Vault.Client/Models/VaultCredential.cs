namespace Admin_Vault.Client.Models;

public class VaultCredential
{
    public int Id { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public string SecretValue { get; set; } = string.Empty;
    public string OwnerEmail { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string EnvColor => Environment.ToLowerInvariant() switch
    {
        "production" => "#d97706",
        "staging" => "#9333ea",
        "development" => "#2563eb",
        _ => "#6b7280"
    };

    public string BgColor => Environment.ToLowerInvariant() switch
    {
        "production" => "#f59e0b",
        "staging" => "#a855f7",
        "development" => "#3b82f6",
        _ => "#9ca3af"
    };

    public string MaskedValue
    {
        get
        {
            if (string.IsNullOrEmpty(SecretValue)) return string.Empty;
            var prefix = SecretValue.Length > 7 ? SecretValue[..7] : SecretValue;
            var suffix = SecretValue.Length > 4 ? SecretValue[^4..] : string.Empty;
            return $"{prefix}{new string('\u2022', 12)}{suffix}";
        }
    }
}
