/**
 * Full cart view: per-line subtotals (price × quantity), editable quantities, and order total.
 * "Continue shopping" restores the list URL saved when the user clicked Add to cart (see BookList).
 */
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { BOOKS_RETURN_PATH_KEY } from '../constants';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, setItemQuantity } = useCart();

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const continueShopping = () => {
    const path = sessionStorage.getItem(BOOKS_RETURN_PATH_KEY) || '/books';
    navigate(path);
  };

  return (
    <div className="container mt-5 text-start pb-5">
      <h2 className="mb-4">Your cart</h2>

      {cart.length === 0 ? (
        <p className="mb-4">Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Book</th>
                <th scope="col">Unit price</th>
                <th scope="col">Qty</th>
                <th scope="col">Subtotal</th>
                <th scope="col" className="text-end" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {cart.map((item: CartItem) => {
                const line = item.price * item.quantity;
                return (
                  <tr key={item.bookId}>
                    <td>{item.title}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td style={{ maxWidth: '8rem' }}>
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          setItemQuantity(item.bookId, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>${line.toFixed(2)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item.bookId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-top pt-3 mt-3">
        <h3 className="h5">
          Total: <strong>${grandTotal.toFixed(2)}</strong>
        </h3>
      </div>

      <div className="mt-4 d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled>
          Checkout
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={continueShopping}
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

export default CartPage;
