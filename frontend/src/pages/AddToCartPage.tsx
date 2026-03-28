/**
 * Chooses quantity and adds a line to the cart. Prefers book data passed through React Router location.state
 * (no flicker); falls back to GET /Books/:id when the user lands here without state (e.g. refresh).
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Book } from '../types/Book';
import type { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../constants';

function AddToCartPage() {
  const { bookId: bookIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const initialBook = (location.state as { book?: Book } | null)?.book;
  const [book, setBook] = useState<Book | null>(initialBook ?? null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (book || !bookIdParam) return;

    const id = Number(bookIdParam);
    if (Number.isNaN(id)) {
      setLoadError('Invalid book.');
      return;
    }

    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/Books/${id}`);
        if (!response.ok) {
          setLoadError('Book not found.');
          return;
        }
        const data = (await response.json()) as Book;
        setBook(data);
      } catch {
        setLoadError('Could not load this book.');
      }
    };

    void load();
  }, [bookIdParam, book]);

  if (loadError) {
    return (
      <div className="container mt-5 text-start">
        <p>{loadError}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mt-5 text-start">
        <p>Loading…</p>
      </div>
    );
  }

  const unit = book.price;
  const qty = Math.max(1, quantity);
  const lineSubtotal = unit * qty;

  const handleAdd = () => {
    const item: CartItem = {
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: qty,
    };
    addToCart(item);
    navigate('/cart');
  };

  return (
    <div className="container mt-5 text-start">
      <h2>Add to cart</h2>
      <p className="lead mb-1">{book.title}</p>
      <p className="text-muted mb-4">
        {book.author} · {book.category}
      </p>

      <div className="mb-3">
        <label className="form-label fw-bold" htmlFor="qty">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          className="form-control"
          style={{ maxWidth: '12rem' }}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <ul className="list-unstyled mb-4">
        <li>
          <strong>Unit price:</strong> ${unit.toFixed(2)}
        </li>
        <li>
          <strong>Line subtotal:</strong> ${lineSubtotal.toFixed(2)}
        </li>
      </ul>

      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-success" onClick={handleAdd}>
          Add to cart
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
}

export default AddToCartPage;
