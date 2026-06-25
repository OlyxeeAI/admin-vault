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
            TotalProjects = await _db.Projects.CountAsync(),
            TotalCredentials = await _db.Credentials.CountAsync(),
            ActiveApiKeys = await _db.Credentials.CountAsync(c => c.Status == "Active"),
            ComplianceDocuments = await _db.Documents.CountAsync(),
            AuditTriggers24h = await _db.AuditLogs.CountAsync(a => a.Timestamp >= since),
            UnauthorizedAttempts24h = await _db.AuditLogs.CountAsync(a => a.Timestamp >= since && a.Status != "SUCCESS")
        };
    }

    public async Task<List<Project>> GetProjectsAsync()
    {
        var projects = await _db.Projects.AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var keyCounts = await _db.Credentials
            .GroupBy(c => c.ProjectId)
            .Select(g => new { ProjectId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.ProjectId, g => g.Count);

        var docCounts = await _db.Documents
            .GroupBy(d => d.ProjectId)
            .Select(g => new { ProjectId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.ProjectId, g => g.Count);

        foreach (var p in projects)
        {
            p.KeyCount = keyCounts.GetValueOrDefault(p.Id);
            p.DocCount = docCounts.GetValueOrDefault(p.Id);
        }

        return projects;
    }

    public async Task<Project?> GetProjectAsync(int id) =>
        await _db.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public async Task AddProjectAsync(Project project)
    {
        project.CreatedAt = DateTime.UtcNow;
        _db.Projects.Add(project);
        await _db.SaveChangesAsync();
    }

    public async Task<List<VaultCredential>> GetCredentialsAsync() =>
        await _db.Credentials.AsNoTracking()
            .Include(c => c.Project)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

    public async Task<List<VaultCredential>> GetCredentialsByProjectAsync(int projectId) =>
        await _db.Credentials.AsNoTracking()
            .Where(c => c.ProjectId == projectId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

    public async Task<List<ComplianceDocument>> GetDocumentsAsync() =>
        await _db.Documents.AsNoTracking()
            .Include(d => d.Project)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync();

    public async Task<List<ComplianceDocument>> GetDocumentsByProjectAsync(int projectId) =>
        await _db.Documents.AsNoTracking()
            .Where(d => d.ProjectId == projectId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync();

    public async Task<List<AuditLog>> GetAuditLogsAsync(int limit = 200) =>
        await _db.AuditLogs.AsNoTracking().OrderByDescending(a => a.Timestamp).Take(limit).ToListAsync();

    public async Task AddCredentialAsync(VaultCredential credential)
    {
        credential.CreatedAt = DateTime.UtcNow;
        credential.Project = null;
        _db.Credentials.Add(credential);
        await _db.SaveChangesAsync();
    }

    public async Task AddDocumentAsync(ComplianceDocument document)
    {
        document.UploadedAt = DateTime.UtcNow;
        document.Project = null;
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
