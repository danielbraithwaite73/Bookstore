/**
 * Paginated book grid for /books. List state lives in the URL (search params) so filters and page
 * are bookmarkable and so "Continue shopping" can restore the exact query string from sessionStorage.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Book } from './types/Book';
import { API_BASE, BOOKS_RETURN_PATH_KEY } from './constants';

/** Page-size selector only allows these values so the API always receives a known pageSize. */
const ALLOWED_PAGE_SIZES = [5, 10, 20] as const;

function BookList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const parsedSize = Number(searchParams.get('pageSize') ?? '5');
  const pageSize = ALLOWED_PAGE_SIZES.includes(
    parsedSize as (typeof ALLOWED_PAGE_SIZES)[number]
  )
    ? parsedSize
    : 5;
  const sortTitle = searchParams.get('sortTitle') === 'true';
  const selectedCategories = searchParams.getAll('cat');

  // Stable dependency for useEffect when category filters change (compare by value, not array reference).
  const categoriesKey = useMemo(
    () => selectedCategories.slice().sort().join('|'),
    [selectedCategories]
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  /** Updates list-related query keys without dropping unrelated params (e.g. cat). Uses replace to avoid cluttering history. */
  const updateQuery = (patch: {
    page?: number;
    pageSize?: number;
    sortTitle?: boolean;
  }) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (patch.page !== undefined) p.set('page', String(patch.page));
        if (patch.pageSize !== undefined)
          p.set('pageSize', String(patch.pageSize));
        if (patch.sortTitle !== undefined)
          p.set('sortTitle', String(patch.sortTitle));
        return p;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Backend expects repeated "categories" keys, same pattern as WaterProject "projectTypes".
        const categoryParams = selectedCategories
          .map((cat) => `categories=${encodeURIComponent(cat)}`)
          .join('&');
        const url = `${API_BASE}/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortTitle=${sortTitle}${
          selectedCategories.length ? `&${categoryParams}` : ''
        }`;

        const response = await fetch(url);
        const data = await response.json();
        const count = data.totalNumBooks as number;
        const list = data.books as Book[];
        const pages = Math.max(1, Math.ceil(count / pageSize));

        setBooks(list);
        setTotalPages(pages);

        // After filtering, the current page may exceed the new page count—clamp to the last valid page.
        if (pageNum > pages) {
          updateQuery({ page: pages });
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sortTitle, categoriesKey]);

  /** Persists return location for CartPage, then navigates with book in state to avoid an extra GET when possible. */
  const goAddToCart = (book: Book) => {
    sessionStorage.setItem(
      BOOKS_RETURN_PATH_KEY,
      `${window.location.pathname}${window.location.search}`
    );
    navigate(`/add-to-cart/${book.bookId}`, { state: { book } });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Bookstore Collection</h1>
        <button
          type="button"
          className={`btn ${sortTitle ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => {
            updateQuery({ sortTitle: !sortTitle, page: 1 });
          }}
        >
          {sortTitle ? 'Sorted by Title' : 'Sort by Title'}
        </button>
      </div>

      <div className="row">
        {books.map((p) => (
          <div className="col-12 mb-3" key={p.bookId}>
            <div className="card shadow-sm">
              <div className="card-body text-start">
                <h3 className="card-title text-primary">{p.title}</h3>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li>
                        <strong>Author:</strong> {p.author}
                      </li>
                      <li>
                        <strong>Publisher:</strong> {p.publisher}
                      </li>
                      <li>
                        <strong>ISBN:</strong> {p.isbn}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li>
                        <strong>Classification:</strong> {p.classification}
                      </li>
                      <li>
                        <strong>Category:</strong> {p.category}
                      </li>
                      <li>
                        <strong>Pages:</strong> {p.pageCount}
                      </li>
                      <li>
                        <strong>Price:</strong> ${p.price.toFixed(2)}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => goAddToCart(p)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center flex-wrap">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              disabled={pageNum === 1}
              onClick={() => updateQuery({ page: pageNum - 1 })}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => updateQuery({ page: index + 1 })}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
          >
            <button
              type="button"
              className="page-link"
              disabled={pageNum === totalPages}
              onClick={() => updateQuery({ page: pageNum + 1 })}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-3 text-center pb-5">
        <label className="me-2 fw-bold" htmlFor="results-per-page">
          Results per page:
        </label>
        <select
          id="results-per-page"
          className="form-select d-inline-block w-auto"
          value={pageSize}
          onChange={(e) => {
            const next = Number(e.target.value);
            updateQuery({ pageSize: next, page: 1 });
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
