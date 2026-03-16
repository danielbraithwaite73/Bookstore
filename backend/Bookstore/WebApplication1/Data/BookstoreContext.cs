using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Data;
// This file is used to create the database context for the bookstore application.
// It defines the BookstoreContext class, which inherits from DbContext.
// This class will be used to interact with the database.
public partial class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) 
    {

    }
    public DbSet<Book> Books { get; set; }

}
