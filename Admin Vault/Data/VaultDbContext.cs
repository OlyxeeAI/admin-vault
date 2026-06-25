using Admin_Vault.Client.Models;
using Microsoft.EntityFrameworkCore;

namespace Admin_Vault.Data;

public class VaultDbContext : DbContext
{
    public VaultDbContext(DbContextOptions<VaultDbContext> options) : base(options) { }

    public DbSet<VaultCredential> Credentials => Set<VaultCredential>();
    public DbSet<ComplianceDocument> Documents => Set<ComplianceDocument>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VaultCredential>().ToTable("credentials");
        modelBuilder.Entity<ComplianceDocument>().ToTable("documents");
        modelBuilder.Entity<AuditLog>().ToTable("audit_logs");
    }
}
