using Admin_Vault.Client.Models;

namespace Admin_Vault.Client.Services;

public interface IVaultDataService
{
    Task<DashboardStats> GetDashboardStatsAsync();

    Task<List<Project>> GetProjectsAsync();
    Task<Project?> GetProjectAsync(int id);
    Task AddProjectAsync(Project project);

    Task<List<VaultCredential>> GetCredentialsAsync();
    Task<List<VaultCredential>> GetCredentialsByProjectAsync(int projectId);

    Task<List<ComplianceDocument>> GetDocumentsAsync();
    Task<List<ComplianceDocument>> GetDocumentsByProjectAsync(int projectId);

    Task<List<AuditLog>> GetAuditLogsAsync(int limit = 200);

    Task AddCredentialAsync(VaultCredential credential);
    Task AddDocumentAsync(ComplianceDocument document);
    Task AddAuditLogAsync(AuditLog log);
}
