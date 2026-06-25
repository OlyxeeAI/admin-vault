using Npgsql;

namespace Admin_Vault.Data;

public static class DatabaseConnection
{
    /// <summary>
    /// Accepts either a libpq URI (postgres://user:pass@host:port/db, e.g. a Supabase
    /// pooler string) or an already-formatted Npgsql key/value connection string and
    /// returns a valid Npgsql connection string.
    /// </summary>
    public static string BuildNpgsqlConnectionString(string raw)
    {
        raw = raw.Trim();

        if (!raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            // Already a key/value connection string.
            return raw;
        }

        var uri = new Uri(raw);
        var userInfo = uri.UserInfo.Split(':', 2);

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port == -1 ? 5432 : uri.Port,
            Database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/')),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : null,
            SslMode = SslMode.Require,
            Pooling = true
        };

        return builder.ConnectionString;
    }
}
