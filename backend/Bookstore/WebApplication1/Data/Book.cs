using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Data;

/// <summary>
/// Entity mapped to the Books table. Shapes the API response consumed by the React app.
/// Note: JSON serialization uses camelCase (bookId, pageCount, …) even though C# properties are PascalCase.
/// </summary>
public partial class Book
{
    [Key]
    public int BookId { get; set; }

    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string Author { get; set; } = null!;

    [Required]
    public string Publisher { get; set; } = null!;

    [Required]
    public string ISBN { get; set; } = null!;

    [Required]
    public string Classification { get; set; } = null!;

    /// <summary>
    /// Used for filtering in <c>GET /Books/AllBooks?categories=...</c> and for display on cards.
    /// </summary>
    [Required]
    public string Category { get; set; } = null!;

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}
