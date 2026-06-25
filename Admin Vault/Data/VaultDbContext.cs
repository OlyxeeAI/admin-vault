using Admin_Vault.Client.Models;
using Microsoft.EntityFrameworkCore;

namespace Admin_Vault.Data;

public class VaultDbContext : DbContext
{
    public VaultDbContext(DbContextOptions<VaultDbContext> options) : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<VaultCredential> Credentials => Set<VaultCredential>();
    public DbSet<ComplianceDocument> Documents => Set<ComplianceDocument>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("projects");
            e.Ignore(p => p.KeyCount);
            e.Ignore(p => p.DocCount);
            e.Ignore(p => p.Initials);
            e.Ignore(p => p.AccentColor);
        });

        modelBuilder.Entity<VaultCredential>(e =>
        {
            e.ToTable("credentials");
            e.HasOne(c => c.Project)
                .WithMany()
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ComplianceDocument>(e =>
        {
            e.ToTable("documents");
            e.HasOne(d => d.Project)
                .WithMany()
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuditLog>().ToTable("audit_logs");
    }
}
