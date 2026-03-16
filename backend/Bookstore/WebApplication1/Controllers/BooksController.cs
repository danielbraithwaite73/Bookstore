using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;

namespace WebApplication1.Controllers
{

    // This controller handles requests related to books. It provides an endpoint to retrieve a paginated list of books, with optional sorting by title.
    // The total number of books is also included in the response for client-side pagination purposes.
    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private BookstoreContext _Context;
        public BooksController(BookstoreContext temp) => _Context = temp;

        [HttpGet("AllBooks")]
        public IActionResult Get(int pageSize = 10, int pageNum = 1, bool sortTitle = false)
        {
            var totalNumBooks = _Context.Books.Count();

            // Starts with the full Books dataset as a queryable
            var query = _Context.Books.AsQueryable();

            // Apply sorting if requested
            if (sortTitle)
            {
                query = query.OrderBy(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.BookId); 
            }

            // Apply pagination to the (potentially sorted) query
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return the total number of books and the paginated list of books
            return Ok(new
            {
                TotalNumBooks = totalNumBooks,
                Books = books
            });
        }
    }
}
