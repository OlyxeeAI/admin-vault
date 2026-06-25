namespace Admin_Vault.Client.Models;

public class DashboardStats
{
    public int TotalCredentials { get; set; }
    public int ActiveApiKeys { get; set; }
    public int ComplianceDocuments { get; set; }
    public int AuditTriggers24h { get; set; }
    public int UnauthorizedAttempts24h { get; set; }
}
