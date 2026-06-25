using Admin_Vault.Client.Models;
using Admin_Vault.Client.Services;
using Microsoft.EntityFrameworkCore;

namespace Admin_Vault.Data;

public class VaultDataService : IVaultDataService
{
    private readonly VaultDbContext _db;

    public VaultDataService(VaultDbContext db) => _db = db;

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var since = DateTime.UtcNow.AddHours(-24);
        return new DashboardStats
        {
            TotalCredentials = await _db.Credentials.CountAsync(),
            ActiveApiKeys = await _db.Credentials.CountAsync(c => c.Status == "Active"),
            ComplianceDocuments = await _db.Documents.CountAsync(),
            AuditTriggers24h = await _db.AuditLogs.CountAsync(a => a.Timestamp >= since),
            UnauthorizedAttempts24h = await _db.AuditLogs.CountAsync(a => a.Timestamp >= since && a.Status != "SUCCESS")
        };
    }

    public async Task<List<VaultCredential>> GetCredentialsAsync() =>
        await _db.Credentials.AsNoTracking().OrderByDescending(c => c.CreatedAt).ToListAsync();

    public async Task<List<ComplianceDocument>> GetDocumentsAsync() =>
        await _db.Documents.AsNoTracking().OrderByDescending(d => d.UploadedAt).ToListAsync();

    public async Task<List<AuditLog>> GetAuditLogsAsync(int limit = 200) =>
        await _db.AuditLogs.AsNoTracking().OrderByDescending(a => a.Timestamp).Take(limit).ToListAsync();

    public async Task AddCredentialAsync(VaultCredential credential)
    {
        credential.CreatedAt = DateTime.UtcNow;
        _db.Credentials.Add(credential);
        await _db.SaveChangesAsync();
    }

    public async Task AddDocumentAsync(ComplianceDocument document)
    {
        document.UploadedAt = DateTime.UtcNow;
        _db.Documents.Add(document);
        await _db.SaveChangesAsync();
    }

    public async Task AddAuditLogAsync(AuditLog log)
    {
        log.Timestamp = DateTime.UtcNow;
        _db.AuditLogs.Add(log);
        await _db.SaveChangesAsync();
    }
}
