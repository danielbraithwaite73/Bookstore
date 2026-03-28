/**
 * Top-level shell: provides cart state to the whole tree and declares client-side routes.
 * CartProvider wraps Router so any route (including /cart) can call useCart().
 */
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import AddToCartPage from './pages/AddToCartPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/add-to-cart/:bookId" element={<AddToCartPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
