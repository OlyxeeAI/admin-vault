using Admin_Vault.Client.Models;

namespace Admin_Vault.Client.Services;

public interface IVaultDataService
{
    Task<DashboardStats> GetDashboardStatsAsync();
    Task<List<VaultCredential>> GetCredentialsAsync();
    Task<List<ComplianceDocument>> GetDocumentsAsync();
    Task<List<AuditLog>> GetAuditLogsAsync(int limit = 200);
    Task AddCredentialAsync(VaultCredential credential);
    Task AddDocumentAsync(ComplianceDocument document);
    Task AddAuditLogAsync(AuditLog log);
}
