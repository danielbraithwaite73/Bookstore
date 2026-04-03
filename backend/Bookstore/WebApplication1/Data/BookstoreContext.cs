using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Data;

/// <summary>EF Core context; connection string name <c>BookConnection</c> in configuration.</summary>
public partial class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }
}
