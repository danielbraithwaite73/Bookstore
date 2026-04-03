using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;

namespace WebApplication1.Controllers;

/// <summary>Book API. Route prefix is <c>/Books</c> (from controller name).</summary>
[Route("[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _Context;

    public BooksController(BookstoreContext temp) => _Context = temp;

    /// <summary>
    /// Paged list. <paramref name="categories"/> is OR-matched (book in any listed category).
    /// <c>TotalNumBooks</c> is the filtered count so the client can page correctly.
    /// </summary>
    /// <param name="categories">Repeat query key, e.g. <c>?categories=A&amp;categories=B</c>.</param>
    [HttpGet("AllBooks")]
    public IActionResult Get(int pageSize = 10, int pageNum = 1, bool sortTitle = false, [FromQuery] List<string>? categories = null)
    {
        IQueryable<Book> query = _Context.Books.AsQueryable();

        if (categories != null && categories.Any())
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        var totalNumBooks = query.Count();

        query = sortTitle
            ? query.OrderBy(b => b.Title)
            : query.OrderBy(b => b.BookId);

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            TotalNumBooks = totalNumBooks,
            Books = books
        });
    }

    /// <summary>Distinct category values for the storefront filter UI.</summary>
    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        var categories = _Context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }

    /// <summary>Single book by id (e.g. add-to-cart opened directly without navigation state).</summary>
    [HttpGet("{bookId:int}")]
    public IActionResult GetBook(int bookId)
    {
        var book = _Context.Books.Find(bookId);
        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    /// <summary>Creates a book; database assigns <see cref="Book.BookId"/>.</summary>
    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _Context.Books.Add(newBook);
        _Context.SaveChanges();
        return Ok(newBook);
    }

    /// <summary>Replaces editable fields for the book identified by <paramref name="bookId"/>.</summary>
    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _Context.Books.Find(bookId);
        if (existingBook == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _Context.Books.Update(existingBook);
        _Context.SaveChanges();

        return Ok(existingBook);
    }

    /// <summary>Deletes a book by id.</summary>
    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _Context.Books.Find(bookId);

        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        _Context.Books.Remove(book);
        _Context.SaveChanges();

        return NoContent();
    }
}
