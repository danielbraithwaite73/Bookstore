using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

builder.Services.AddCors();

var app = builder.Build();

// Run CORS before redirects/auth so every response (including preflight) gets the headers. Required for browser fetch from Static Web Apps.
app.UseCors(x =>
    x.WithOrigins(
            "http://localhost:3000",
            "https://ambitious-pebble-0e9100f03.2.azurestaticapps.net")
        .AllowAnyHeader()
        .AllowAnyMethod());

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
