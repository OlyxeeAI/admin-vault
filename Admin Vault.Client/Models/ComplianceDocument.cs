namespace Admin_Vault.Client.Models;

public class ComplianceDocument
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
    public string FileName { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string Sha256 { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string UploadedBy { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty;

    public string FileSizeString
    {
        get
        {
            double kb = FileSizeBytes / 1024d;
            return kb < 1024 ? $"{kb:F1} KB" : $"{kb / 1024d:F1} MB";
        }
    }

    public string ShortChecksum
    {
        get
        {
            if (string.IsNullOrEmpty(Sha256)) return string.Empty;
            return Sha256.Length > 16 ? $"{Sha256[..8]}...{Sha256[^8..]}" : Sha256;
        }
    }
}
