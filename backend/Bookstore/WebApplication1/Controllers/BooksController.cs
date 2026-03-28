using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;

namespace WebApplication1.Controllers;

/// <summary>
/// REST API for books: paginated listing with optional filters, plus lookups the React app uses for navigation and filters.
/// Routes are rooted at "Books" because of <see cref="RouteAttribute"/> on the controller name (BooksController → /Books/...).
/// </summary>
[Route("[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _Context;

    public BooksController(BookstoreContext temp) => _Context = temp;

    /// <summary>
    /// Returns one page of books and the <b>filtered</b> total count so the client can render correct pagination.
    /// Category filtering uses OR semantics across the selected values: a book matches if its Category is in the list.
    /// </summary>
    /// <param name="categories">
    /// Repeated query keys bind to a list, e.g. <c>?categories=Fiction&amp;categories=Biography</c>.
    /// Omitting this parameter returns all books (subject to pagination).
    /// </param>
    [HttpGet("AllBooks")]
    public IActionResult Get(int pageSize = 10, int pageNum = 1, bool sortTitle = false, [FromQuery] List<string>? categories = null)
    {
        // Build a composable EF query: filter first, count, then sort and page.
        // Count must run after filters so TotalNumBooks matches what the user sees.
        IQueryable<Book> query = _Context.Books.AsQueryable();

        if (categories != null && categories.Any())
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        var totalNumBooks = query.Count();

        // Stable default sort by id; optional title sort for browsing.
        query = sortTitle
            ? query.OrderBy(b => b.Title)
            : query.OrderBy(b => b.BookId);

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Anonymous type serializes to JSON with camelCase property names (default in modern ASP.NET).
        return Ok(new
        {
            TotalNumBooks = totalNumBooks,
            Books = books
        });
    }

    /// <summary>
    /// Distinct category labels from the database, ordered for display in the sidebar filter.
    /// </summary>
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

    /// <summary>
    /// Fetches a single book by primary key. Used when the add-to-cart route is opened directly
    /// (bookmark/refresh) and the client did not pass book data through client-side navigation state.
    /// </summary>
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
}
