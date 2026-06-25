using Admin_Vault.Client.Pages;
using Admin_Vault.Client.Services;
using Admin_Vault.Components;
using Admin_Vault.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents();

builder.Services.AddHttpContextAccessor();

// Database (Supabase / PostgreSQL)
var rawConnection = builder.Configuration["SUPABASE_DB_URL"]
    ?? Environment.GetEnvironmentVariable("SUPABASE_DB_URL");

if (string.IsNullOrWhiteSpace(rawConnection))
{
    throw new InvalidOperationException(
        "SUPABASE_DB_URL is not configured. Add your Supabase connection string in the Secrets pane.");
}

var connectionString = DatabaseConnection.BuildNpgsqlConnectionString(rawConnection);

builder.Services.AddDbContext<VaultDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<IVaultDataService, VaultDataService>();

var app = builder.Build();

// Ensure the database schema exists.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VaultDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(Admin_Vault.Client._Imports).Assembly);

app.Run();
