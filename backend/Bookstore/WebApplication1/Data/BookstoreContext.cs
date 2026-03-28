using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Data;

/// <summary>
/// EF Core database context for the bookstore. Registered in <c>Program.cs</c> and injected into controllers.
/// The connection string name used here matches configuration (e.g. appsettings.json "BookConnection").
/// </summary>
public partial class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
    }

    /// <summary>All books in the SQLite database.</summary>
    public DbSet<Book> Books { get; set; }
}
