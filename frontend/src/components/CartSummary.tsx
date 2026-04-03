import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className="cart-summary-floating"
      onClick={() => navigate('/cart')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/cart');
        }
      }}
    >
      <span className="cart-summary-icon" aria-hidden>
        🛒
      </span>
      <span className="cart-summary-text">
        <strong>{itemCount}</strong> {itemCount === 1 ? 'item' : 'items'} ·{' '}
        <strong>${totalAmount.toFixed(2)}</strong>
      </span>
    </div>
  );
};

export default CartSummary;
