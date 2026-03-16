import { useEffect, useState } from "react";
import type { Book } from "./types/book";

function BookList() {
    //State variables to manage books, pagination, sorting, and total counts
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortTitle, setSortTitle] = useState(false);

    // Fetch books from the API whenever pagination or sorting parameters change
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(
                    `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortTitle=${sortTitle}`
                );
                const data = await response.json();
                setBooks(data.books);
                setTotalItems(data.totalNumBooks);
                // Calculate total pages based on the fresh data from the API
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, [pageSize, pageNum, totalItems,sortTitle]); // Triggers re-fetch on any of these changes

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Bookstore Collection</h1>
                {/* Sort Button */}
                <button 
                    className={`btn ${sortTitle ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                        setSortTitle(!sortTitle);
                        setPageNum(1); // Reset to page 1 to see the start of the sorted list
                    }}>
                    <i className={`bi ${sortTitle ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'} me-2`}></i>
                    {sortTitle ? "Sorted by Title" : "Sort by Title"}
                </button>
            </div>

            <div className="row">
                {/* Book Cards */}
                {books.map((p) => (
                    <div className="col-12 mb-3" key={p.bookId}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title text-primary">{p.title}</h3>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li><strong>Author:</strong> {p.author}</li>
                                            <li><strong>Publisher:</strong> {p.publisher}</li>
                                            <li><strong>ISBN:</strong> {p.isbn}</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li><strong>Classification:</strong> {p.classification}</li>
                                            <li><strong>Category:</strong> {p.category}</li>
                                            <li><strong>Pages:</strong> {p.pageCount}</li>
                                            <li><strong>Price:</strong> ${p.price}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                        {/* Previous Button */}
                        <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>
                            Previous
                        </button>
                    </li>
                    {/* Page Numbers, dynamically generated */}
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index + 1} className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPageNum(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                        {/* Next Button */}
                        <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Results per page selector */}
            <div className="mt-3 text-center pb-5">
                <label className="me-2 fw-bold">Results per page:</label>
                <select 
                    className="form-select d-inline-block w-auto" 
                    value={pageSize} 
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1);
                    }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
}

export default BookList;