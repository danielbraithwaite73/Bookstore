using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

var builder = WebApplication.CreateBuilder(args);

// Web API: JSON controllers + generated OpenAPI document in Development.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Entity Framework: SQLite via named connection string "BookConnection".
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

// CORS must be registered before UseCors in the pipeline.
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Browser security: only this origin may call the API from JavaScript.
// Must match the Vite dev server (see frontend vite.config.ts port).
app.UseCors(x => x.WithOrigins("http://localhost:3000"));

app.UseAuthorization();

app.MapControllers();

app.Run();
